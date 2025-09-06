using System.Text.Json;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Microsoft.AspNetCore.Identity;
using backend.DTOs;
using backend.Entities;
using backend.Enums;
using backend.Exceptions;
using backend.Settings;
using backend.Mappings;
using backend.Utilities;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Gmail.v1;
using Google.Apis.Util.Store;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Mscc.GenerativeAI.Web;
using ClientSecrets = Google.Apis.Auth.OAuth2.ClientSecrets;
using Message = Google.Apis.Gmail.v1.Data.Message;

namespace backend.Services;

public class EmailService(
    UserManager<User> userManager,
    IOptions<GoogleSettings> googleSettings,
    ILogger<EmailService> logger,
    ApplicationDbContext dbContext,
    IMemoryCache cache,
    CacheService cacheService,
    IBackgroundJobClient backgroundJobClient,
    NotificationService notificationService,
    IGenerativeModelService aiService,
    IServiceProvider serviceProvider)
{
    private readonly GoogleSettings _googleSettings = googleSettings.Value;
    private GmailService? _gmailService;
    private const int DefaultBatchSize = 10;
    private const int DefaultDelayMs = 200;
    private const int InitialFetchLimit = 10; 
    private const int SyncFetchLimit = 20;
    private const int DefaultPageSize = 10;
    
    private async Task InitializeAsync(
        User user,
        CancellationToken cancellationToken)
    {
        var accessToken = await userManager.GetAuthenticationTokenAsync(user, "Google", "access_token");
        var refreshToken = await userManager.GetAuthenticationTokenAsync(user, "Google", "refresh_token");

        if (string.IsNullOrEmpty(accessToken) || string.IsNullOrEmpty(refreshToken))
        {
            logger.LogWarning("Token refresh failed - refresh token missing");
            throw new UnauthorizedException("Google authentication tokens not found for the user.", "Unauthorized");
        }

        var tokenResponse = new TokenResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };

        var clientSecrets = new ClientSecrets
        {
            ClientId = _googleSettings.ClientId,
            ClientSecret = _googleSettings.ClientSecret
        };

        var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
        {
            ClientSecrets = clientSecrets,
            Scopes = [GmailService.Scope.GmailReadonly],
            DataStore = new NullDataStore()
        });

        var credential = new UserCredential(flow, user.Id, tokenResponse);

        bool refreshed = await credential.RefreshTokenAsync(cancellationToken);
        if (refreshed)
        {
            await userManager.SetAuthenticationTokenAsync(user, "Google", "access_token", credential.Token.AccessToken);
        }

        _gmailService = new GmailService(new BaseClientService.Initializer
        {
            HttpClientInitializer = credential,
            ApplicationName = "SmartPly"
        });
    }
    
    public async Task ClassifyAndMatchEmailsAsync(
    List<string> emailIds,
    string userId,
    CancellationToken cancellationToken)
    {
        using var scope = serviceProvider.CreateScope();
        var generativeAiService = scope.ServiceProvider.GetRequiredService<AiService>();
        
        var model = aiService.CreateInstance();
        var userApplications = await dbContext.Applications
            .Where(a => a.UserId == userId)
            .Select(a => a.ToApplicationAiPromptDto())
            .ToListAsync(cancellationToken);
        
        foreach (var id in emailIds)
        {
            await generativeAiService.ClassifyAndMatchEmailAsync(userId, id, model, userApplications, cancellationToken);
        }
    }
    
    public async Task FetchInitialEmailsAsync(
        string? userId,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }

        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            logger.LogWarning("Get current user failed - user ID not found");
            throw new UnauthorizedException("User not found.");
        }

        await InitializeAsync(user, cancellationToken);

        try
        {
            var messages = new List<Message>();
        
            var listRequest = _gmailService!.Users.Messages.List("me");
            listRequest.MaxResults = InitialFetchLimit; 

            var listResponse = await listRequest.ExecuteAsync(cancellationToken);
        
            if (listResponse.Messages is not null && listResponse.Messages.Any())
            {
                foreach (var batch in listResponse.Messages.Chunk(DefaultBatchSize))
                {
                    var batchTasks = batch.Select(async msg =>
                    {
                        var getRequest = _gmailService.Users.Messages.Get("me", msg.Id);
                        getRequest.Format = UsersResource.MessagesResource.GetRequest.FormatEnum.Metadata; 
                        return await getRequest.ExecuteAsync(cancellationToken);
                    });

                    var fetchedBatch = await Task.WhenAll(batchTasks);
                    messages.AddRange(fetchedBatch);
                
                    await Task.Delay(DefaultDelayMs, cancellationToken);
                }
            }
        
            var emails = messages.Select(msg => EmailMappings.MapToEmailEntity(msg, userId)).ToList();
            await dbContext.Emails.AddRangeAsync(emails, cancellationToken);

            user.LastSyncedAt = DateTime.UtcNow;
            user.IsInitialSyncComplete = true;
            
            if (!user.IsRecurringSyncScheduled)
            {
                RecurringJob.AddOrUpdate<EmailService>(
                    $"user-{userId}-email-sync",
                    s => s.SyncUserEmailAsync(userId, CancellationToken.None),
                    "*/10 * * * *",
                    new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc });

                user.IsRecurringSyncScheduled = true;
                logger.LogInformation("Recurring sync scheduled for UserId: {UserId}", user.Id);
            }

            await userManager.UpdateAsync(user);
            
            var emailIds = emails.OrderByDescending(e => e.InternalDate).Select(e => e.Id).ToList();
            var jobId = backgroundJobClient.Enqueue(() => ClassifyAndMatchEmailsAsync(emailIds, userId, CancellationToken.None));
            
            HangfireJob hangfireJob = new HangfireJob
            {
                HangfireJobId = jobId,
                UserId = user.Id,
            };
        
            dbContext.HangfireJobs.Add(hangfireJob);
            
            cacheService.InvalidateUserEmailCache(userId);
            
            logger.LogInformation("Initial email fetch completed for UserId: {UserId}. Processed {Count} messages",
                user.Id, listResponse.Messages?.Count ?? 0);

            NotificationRequestDto notificationRequestDto = new NotificationRequestDto
            {
                Title = "Initial Email Sync Completed",
                Message = "Your initial email sync has been successfully completed.",
                Type = NotificationType.otherUpdate,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            await notificationService.AddNotificationAsync(userId, notificationRequestDto,cancellationToken);
            
            logger.LogInformation("Notification sent to user {UserId} for initial email sync completion", userId);
        }
        catch (Exception ex)
        {
            user.IsInitialSyncStarted = false; 
            await userManager.UpdateAsync(user);
            logger.LogError(ex, "Initial email fetch failed for UserId: {UserId}", user.Id);
            throw;
        }
    }

    public async Task SyncUserEmailAsync(
        string? userId,
        CancellationToken cancellationToken)
    {
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }
        
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            logger.LogWarning("Get current user failed - user ID not found");
            throw new UnauthorizedException("User not found.");
        }
        
        if ( !user.IsInitialSyncComplete)
        {
            logger.LogWarning("User has not completed initial sync.");
            throw new BadRequestException("User has not completed initial sync.");
        }
        
        await InitializeAsync(user, cancellationToken);
        
        var lastSyncTimestamp = user.LastSyncedAt?.ToUniversalTime() ?? DateTime.UtcNow.AddDays(-30).ToUniversalTime();
        var unixTimestamp = ((DateTimeOffset)lastSyncTimestamp).ToUnixTimeSeconds();

        var listRequest = _gmailService!.Users.Messages.List("me");
        listRequest.Q = $"after:{unixTimestamp}";
        listRequest.MaxResults = SyncFetchLimit;

        var listResponse = await listRequest.ExecuteAsync(cancellationToken);

        if (listResponse.Messages != null && listResponse.Messages.Any())
        {
            List<string> emailIds = [];
            foreach (var batch in listResponse.Messages.Chunk(DefaultBatchSize))
            {
                var batchTasks = batch.Select(async message =>
                {
                    var getRequest = _gmailService.Users.Messages.Get("me", message.Id);
                    getRequest.Format = UsersResource.MessagesResource.GetRequest.FormatEnum.Metadata;
                    return await getRequest.ExecuteAsync(cancellationToken);
                });

                var fetchedBatch = await Task.WhenAll(batchTasks);
                
                var messages = fetchedBatch.ToList();
                var messageIds = messages.Select(m => m.Id).ToList();

                var existingEmails = await dbContext.Emails
                    .Where(e => e.UserId == userId && messageIds.Contains(e.Id))
                    .ToListAsync(cancellationToken);

                var existingEmailIds = existingEmails.Select(e => e.Id).ToHashSet();
    
                var emailsToAdd = new List<Email>();
                var emailsToUpdate = new List<Email>();

                foreach (var message in messages)
                {
                    var email = EmailMappings.MapToEmailEntity(message, userId);
        
                    if (existingEmailIds.Contains(message.Id))
                    {
                        var existingEmail = existingEmails.First(e => e.Id == message.Id);
                        existingEmail.UpdateEmail(email);
                        emailsToUpdate.Add(existingEmail);
                    }
                    else
                    {
                        emailsToAdd.Add(email);
                    }
                }

                if (emailsToAdd.Any())
                {
                    await dbContext.Emails.AddRangeAsync(emailsToAdd, cancellationToken);
                }

                if (emailsToUpdate.Any())
                {
                    dbContext.Emails.UpdateRange(emailsToUpdate);
                }
                
                emailIds.AddRange(emailsToAdd.OrderByDescending(e => e.InternalDate).Select(e => e.Id));

                logger.LogInformation("Upserted {AddCount} new and {UpdateCount} existing emails for user {UserId}", 
                    emailsToAdd.Count, emailsToUpdate.Count, userId);
                
                await Task.Delay(DefaultDelayMs, cancellationToken);
            }
            var jobId = backgroundJobClient.Enqueue(() => ClassifyAndMatchEmailsAsync(emailIds, userId, CancellationToken.None));
            HangfireJob hangfireJob = new HangfireJob
            {
                HangfireJobId = jobId,
                UserId = user.Id,
            };
        
            dbContext.HangfireJobs.Add(hangfireJob);
            cacheService.InvalidateUserEmailCache(userId);
        }

        user.LastSyncedAt = DateTime.UtcNow;
        await userManager.UpdateAsync(user);
        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Date-based sync completed for user {UserId}. Processed {Count} messages", 
            userId, listResponse.Messages?.Count ?? 0);
    }
    
    public async Task<PaginationResultDto<EmailResponseDto>> GetEmailsAsync( 
        EmailQueryParameters query,
        string? userId,
        CancellationToken cancellationToken)
    {
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }

        logger.LogInformation("Retrieving emails for user with ID {UserId}", userId); 

        string cacheKey = cacheService.GenerateEmailsCacheKey(userId,query);
        
        if (cache.TryGetValue(cacheKey, out PaginationResultDto<EmailResponseDto>? cachedResult))
        {
            logger.LogDebug("Cache hit for emails query: {CacheKey}", cacheKey);
            return cachedResult!;
        }
        
        logger.LogDebug("Cache miss for emails query: {CacheKey}", cacheKey);

        IQueryable<EmailResponseDto> emailQuery = dbContext.Emails
            .AsNoTracking()
            .Where(a => a.UserId == userId && (!query.jobEmail || a.IsJobRelated))
            .OrderByDescending(e => e.InternalDate)
            .Select(e => e.ToEmailResponseDto());
        
        var paginationResult = await PaginationResultDto<EmailResponseDto>.CreateAsync(
            emailQuery, query.Page ?? 1, query.PageSize ?? DefaultPageSize,cancellationToken);
        
        cacheService.CacheEmailsResult(cacheKey, paginationResult, userId);
        
        return paginationResult;
    }
    
    public async Task<Message> GetEmailByIdAsync(
        string? id,
        string? userId,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(id))
        {
            logger.LogWarning("Invalid email id provided.");
            throw new BadRequestException("The provided email ID is invalid.");
        }
        
        logger.LogInformation("Retrieving email with ID {EmailId}", id);

        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }
        
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            logger.LogWarning("Get current user failed - user ID not found");
            throw new UnauthorizedException("User not found.");
        }
        
        await InitializeAsync(user, cancellationToken);
    
        var getRequest = _gmailService!.Users.Messages.Get("me", id);
        getRequest.Format = UsersResource.MessagesResource.GetRequest.FormatEnum.Full;
    
        return await getRequest.ExecuteAsync(cancellationToken);
    }
    
    

}
