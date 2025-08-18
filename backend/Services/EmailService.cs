using System.Net.Http.Headers;
using System.Text;
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
using Mscc.GenerativeAI;
using Newtonsoft.Json;
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
    IConfiguration configuration,
    NotificationService notificationService)
{
    private readonly GoogleSettings _googleSettings = googleSettings.Value;
    private GmailService? _gmailService;
    private const int DefaultBatchSize = 10;
    private const int DefaultDelayMs = 200;
    private const int InitialFetchLimit = 100;
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
    
    public async Task ProcessEmailsWithAI(
    List<string> emailIds,
    string? userId,
    CancellationToken cancellationToken)
    {
        var apiKey = configuration["GoogleAI:ApiKey"];
        var googleAI = new GoogleAI(apiKey: apiKey);
        var model = googleAI.GenerativeModel(model: Model.Gemini15Pro);

        foreach (var id in emailIds)
        {
            var existingEmail = await dbContext.Emails
                .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId, cancellationToken);

            if (existingEmail is null)
            {
                logger.LogWarning($"Email with id {id} was not found.");
                throw new NotFoundException($"Email with id {id} was not found.");
            }

            Message? fullEmail = await GetEmailByIdAsync(id, userId, cancellationToken);
            var decodedBody = EmailUtilities.GetDecodedEmailBody(fullEmail);

            var promptText = $@"
                You are an AI that classifies emails related to job applications.
                Given these email's info:
                - Subject
                - FromAddress
                - FromName
                - Snippet
                - EmailBodyText
                determine:
                1. If the email is related to a job application or recruitment.
                2. If yes, assign one category from:
                   - interview
                   - offer
                   - applied
                   - rejection
                   - otherUpdates
                3. If yes, provide a concise summary of the email in 1–2 sentences.
                EMAIL TEXT:
                """"""
                {decodedBody}
                """"""
                EMAIL INFO:
                {{
                    ""subject"": ""{existingEmail.Subject}"",
                    ""from_address"": ""{existingEmail.FromAddress}"",
                    ""from_name"": ""{existingEmail.FromName}"",
                    ""snippet"": ""{existingEmail.Snippet}""
                }}
                OUTPUT JSON FORMAT:
                {{
                  ""is_job_related"": boolean,
                  ""category"": ""string|null"",
                  ""summary"": ""string|null"",
                  ""confidence"": float
                }}
                Rules:
                - If is_job_related is false → category and summary must be null.
                - Use lowercase for category values.
                - confidence is a number from 0 to 1.
                - Summary must be short and factual.";

            int retryCount = 0;
            bool success = false;

            while (!success && retryCount < 2) // Try max twice
            {
                try
                {
                    var result = await model.GenerateContent(promptText, cancellationToken: cancellationToken);
                    logger.LogInformation("AI response for email {EmailId}: {Response}", id, result);

                    success = true;
                    // var aiResponseText = result.Candidates[0].Content.Parts
                    //     .FirstOrDefault()?.Text?.Trim() ?? string.Empty;
                    // var aiResult = JsonConvert.DeserializeObject<EmailAIResult>(aiResponseText);
                    //
                    // existingEmail.IsJobRelated = aiResult.IsJobRelated;
                    // existingEmail.Category = aiResult.Category;
                    // existingEmail.Summary = aiResult.Summary;
                    // existingEmail.UpdatedAt = DateTime.UtcNow;
                }
                catch (HttpRequestException ex) when (ex.Message.Contains("TooManyRequests"))
                {
                    retryCount++;
                    var retryDelay = TimeSpan.FromSeconds(30); 

                    if (ex.Data["Body"] is string bodyJson &&
                        bodyJson.Contains("\"retryDelay\"") &&
                        TimeSpan.TryParse(bodyJson.Split("\"retryDelay\":\"")[1].Split('"')[0].Replace("s", "s"), out var parsedDelay))
                    {
                        retryDelay = parsedDelay;
                    }

                    logger.LogWarning("Rate limit hit. Waiting {Seconds}s before retry {RetryCount}...", retryDelay.TotalSeconds, retryCount);

                    await Task.Delay(retryDelay, cancellationToken);
                }
            }
            
            // Wait between requests to avoid per-minute quota exhaustion
            await Task.Delay(2000, cancellationToken);
        }
        // await dbContext.SaveChangesAsync(cancellationToken);
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
            await dbContext.SaveChangesAsync(cancellationToken);
            
            var emailIds = emails.Select(e => e.Id).ToList();
            // backgroundJobClient.Enqueue(() => ProcessEmailsWithAI(emailIds, userId, CancellationToken.None));
            
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

                await dbContext.SaveChangesAsync(cancellationToken);

                logger.LogInformation("Upserted {AddCount} new and {UpdateCount} existing emails for user {UserId}", 
                    emailsToAdd.Count, emailsToUpdate.Count, userId);
                
                await Task.Delay(DefaultDelayMs, cancellationToken);
            }
        }

        user.LastSyncedAt = DateTime.UtcNow;
        await userManager.UpdateAsync(user);

        logger.LogInformation("Date-based sync completed for user {UserId}. Processed {Count} messages", 
            userId, listResponse.Messages?.Count ?? 0);
        
        cacheService.InvalidateUserEmailCache(userId);
    }
    
    public async Task<PaginationResultDto<Email>> GetEmailsAsync( 
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
        
        if (cache.TryGetValue(cacheKey, out PaginationResultDto<Email>? cachedResult))
        {
            logger.LogDebug("Cache hit for emails query: {CacheKey}", cacheKey);
            return cachedResult!;
        }
        
        logger.LogDebug("Cache miss for emails query: {CacheKey}", cacheKey);

        IQueryable<Email> emailQuery = dbContext.Emails
            .AsNoTracking()
            .Where(a => a.UserId == userId)
            .OrderByDescending(e => e.InternalDate);
        
        var paginationResult = await PaginationResultDto<Email>.CreateAsync(
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
