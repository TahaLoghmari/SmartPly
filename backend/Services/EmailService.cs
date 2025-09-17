using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Microsoft.AspNetCore.Identity;
using backend.DTOs;
using backend.Entities;
using backend.Enums;
using backend.Exceptions;
using backend.Settings;
using backend.Mappings;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Gmail.v1;
using Google.Apis.Util.Store;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
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
    NotificationService notificationService)
{
    private readonly GoogleSettings _googleSettings = googleSettings.Value;
    private GmailService? _gmailService;
    private const int DefaultBatchSize = 10;
    private const int DefaultDelayMs = 200;
    private const int InitialFetchLimit = 5; 
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
            var listRequest = _gmailService!.Users.Messages.List("me");
            listRequest.MaxResults = InitialFetchLimit; 

            var messages = await FetchEmailMetadataInBatchesAsync(listRequest, cancellationToken);
            
            if (!messages.Any())
            {
                logger.LogInformation("No initial emails found for UserId: {UserId}", userId);
                return;
            }
        
            var emails = messages.Select(msg => EmailMappings.MapToEmailEntity(msg, userId)).ToList();
            await dbContext.Emails.AddRangeAsync(emails, cancellationToken);
            
            await EnqueueClassificationJobsAsync(emails, user, cancellationToken);

            user.LastSyncedAt = DateTime.UtcNow;
            user.IsInitialSyncComplete = true;
            ScheduleRecurringSync(user);

            await userManager.UpdateAsync(user);

            NotificationRequestDto notificationRequestDto = new NotificationRequestDto
            {
                Title = "Initial Email Sync Completed",
                Message = "Your initial email sync has been successfully completed.",
                Type = NotificationType.otherUpdate,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };
            await notificationService.AddNotificationAsync(userId, notificationRequestDto,cancellationToken);
            
            cacheService.InvalidateUserEmailCache(userId);
            logger.LogInformation("Initial email fetch completed for UserId: {UserId}. Processed {Count} messages.", user.Id, messages.Count);
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
        
        var lastSyncTimestamp = ((DateTimeOffset)(user.LastSyncedAt ?? DateTime.UtcNow.AddDays(-30))).ToUnixTimeSeconds();
        var listRequest = _gmailService!.Users.Messages.List("me");
        listRequest.Q = $"after:{lastSyncTimestamp}";
        listRequest.MaxResults = SyncFetchLimit;

        var messages = await FetchEmailMetadataInBatchesAsync(listRequest, cancellationToken);
        if (!messages.Any())
        {
            logger.LogInformation("No new emails to sync for user {UserId}", userId);
            user.LastSyncedAt = DateTime.UtcNow; 
            await userManager.UpdateAsync(user);
            return;
        }

        var messageIds = messages.Select(m => m.Id).ToList();
        var existingEmailIds = await dbContext.Emails
            .Where(e => e.UserId == userId && messageIds.Contains(e.Id))
            .Select(e => e.Id)
            .ToHashSetAsync(cancellationToken);

        var emailsToAdd = new List<Email>();
        foreach (var message in messages)
        {
            if (!existingEmailIds.Contains(message.Id))
            {
                emailsToAdd.Add(EmailMappings.MapToEmailEntity(message, userId!));
            }
        }

        if (emailsToAdd.Any())
        {
            await dbContext.Emails.AddRangeAsync(emailsToAdd, cancellationToken);
            await EnqueueClassificationJobsAsync(emailsToAdd, user, cancellationToken);
            logger.LogInformation("Added {AddCount} new emails for user {UserId}", emailsToAdd.Count, userId);
        }

        user.LastSyncedAt = DateTime.UtcNow;
        await userManager.UpdateAsync(user);

        await dbContext.SaveChangesAsync(cancellationToken);

        cacheService.InvalidateUserEmailCache(userId!);
        logger.LogInformation("Date-based sync completed for user {UserId}. Processed {Count} messages.", userId, messages.Count);
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
    
    private async Task<IReadOnlyList<Message>> FetchEmailMetadataInBatchesAsync(
        UsersResource.MessagesResource.ListRequest request,
        CancellationToken cancellationToken)
    {
        var messages = new List<Message>();
        var listResponse = await request.ExecuteAsync(cancellationToken);

        if (listResponse.Messages is null || !listResponse.Messages.Any())
        {
            return messages;
        }

        foreach (var batch in listResponse.Messages.Chunk(DefaultBatchSize))
        {
            var batchTasks = batch.Select(msg =>
            {
                var getRequest = _gmailService!.Users.Messages.Get("me", msg.Id);
                getRequest.Format = UsersResource.MessagesResource.GetRequest.FormatEnum.Metadata;
                return getRequest.ExecuteAsync(cancellationToken);
            });
            
            messages.AddRange(await Task.WhenAll(batchTasks));
            await Task.Delay(DefaultDelayMs, cancellationToken);
        }

        return messages;
    }
    
    private async Task EnqueueClassificationJobsAsync(IEnumerable<Email> emails, User user, CancellationToken cancellationToken)
    {
        var hangfireJobs = new List<HangfireJob>();
        string? previousJobId = null;

        foreach (var email in emails.OrderBy(e => e.InternalDate))
        {
            var fullEmail = await GetEmailByIdAsync(email.Id, user.Id, cancellationToken);

            string currentJobId;
            if (string.IsNullOrEmpty(previousJobId))
            {
                currentJobId = backgroundJobClient.Enqueue<AiService>(s =>
                    s.ClassifyAndMatchEmailAsync(user.Id, fullEmail.Id, CancellationToken.None, fullEmail));
            }
            else
            {
                currentJobId = backgroundJobClient.ContinueJobWith<AiService>(previousJobId, s =>
                    s.ClassifyAndMatchEmailAsync(user.Id, fullEmail.Id, CancellationToken.None, fullEmail));
            }

            previousJobId = currentJobId;
            hangfireJobs.Add(new HangfireJob { HangfireJobId = currentJobId, UserId = user.Id });
        }

        await dbContext.HangfireJobs.AddRangeAsync(hangfireJobs, cancellationToken);
    }
    
    private void ScheduleRecurringSync(User user)
    {
        if (user.IsRecurringSyncScheduled) return;

        RecurringJob.AddOrUpdate<EmailService>(
            $"user-{user.Id}-email-sync",
            s => s.SyncUserEmailAsync(user.Id, CancellationToken.None),
            "*/10 * * * *",
            new RecurringJobOptions { TimeZone = TimeZoneInfo.Utc });

        user.IsRecurringSyncScheduled = true;
        logger.LogInformation("Recurring sync scheduled for UserId: {UserId}", user.Id);
    }
}

