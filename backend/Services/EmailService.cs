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
    IConfiguration configuration,
    NotificationService notificationService,
    IGenerativeModelService aiService)
{
    private readonly GoogleSettings _googleSettings = googleSettings.Value;
    private GmailService? _gmailService;
    private const int DefaultBatchSize = 10;
    private const int DefaultDelayMs = 200;
    private const int InitialFetchLimit = 2; // raja3ha 100
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
        var model = aiService.CreateInstance();
        
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
                You are an AI email classifier. Your task is to analyze email content and determine if it is 
                directly related to a job application process involving the recipient.

                CLASSIFICATION RULES:
                - Classify as job-related ONLY if the email is a direct communication about the recipient's personal application, such as:
                    - Applying for a job.
                    - Scheduling or conducting an interview.
                    - Receiving an offer.
                    - Receiving a rejection or status update.
                    - Direct outreach from a recruiter about a specific role for the recipient.
                - DO NOT classify as job-related if the email is generic, promotional, or not specific to the recipient's application. Examples include:
                    - General job market newsletters or career advice.
                    - Job board updates or promotional alerts.
                    - General networking or business-related emails.

                CATEGORIES:
                - interview: For scheduling, confirming, or providing details about an interview.
                - offer: For job offers or related discussions.
                - applied: For confirmations of a submitted application.
                - rejected: For rejection notices.
                - emailUpdate: For any other direct status updates (e.g., ""application under review"").

                INSTRUCTIONS:
                1. Read the EMAIL INFO and EMAIL TEXT provided below.
                2. First, decide if the email matches ANY job-related case (applied, interview, offer, rejection, status update, recruiter outreach).  
                   - If yes, you MUST set `""isJobRelated"": true`.  
                   - If no, set `""isJobRelated"": false`.  
                3. VERY IMPORTANT:  
                   - If `""isJobRelated"": true`, `""category""` MUST be one of the provided categories, and `""summary""` MUST be a concise 1–2 sentence summary.  
                   - If `""isJobRelated"": false`, then `""category""` MUST be null AND `""summary""` MUST be null. Do not output anything else in these fields. 
                4.  Provide a concise, 1-2 sentence summary of the email's content.

                RESPOND ONLY with a valid JSON object. Do not include any extra text, commentary, or markdown formatting like ```json.

                EMAIL INFO:
                {{
                    ""subject"": ""{existingEmail.Subject}"",
                    ""from_address"": ""{existingEmail.FromAddress}"",
                    ""from_name"": ""{existingEmail.FromName}"",
                    ""snippet"": ""{existingEmail.Snippet}""
                }}

                EMAIL TEXT:
                """"""
                {decodedBody}
                """"""

                OUTPUT JSON FORMAT:
                {{
                  ""isJobRelated"": boolean,
                  ""category"": ""string|null"",
                  ""summary"": ""string|null""
                }}
                ";
    
            var result = await model.GenerateContent(promptText);

            var cleanedText = EmailUtilities.CleanJsonResponse(result.Text);
            
            var aiJsonResult = JsonSerializer.Deserialize<JobDetectionPromptResult>(
                cleanedText,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            
            logger.LogInformation(
                "AI response for email {EmailId}: isJobRelated={IsJobRelated}, category={Category}, summary={Summary}",
                id,
                aiJsonResult.IsJobRelated,
                aiJsonResult.Category,
                aiJsonResult.Summary
            );
            
            existingEmail.IsJobRelated = aiJsonResult.IsJobRelated;
            existingEmail.Category = aiJsonResult.Category;
            existingEmail.Summary = aiJsonResult.Summary;

            if (existingEmail.IsJobRelated)
            {
                await Task.Delay(1000, cancellationToken);
                
                promptText = $@"
                You are an AI designed to match an incoming email to a specific job application from a user's 
                tracked list.
                Input: 
                1. The email content.
                2. A JSON array of job applications the user has previously entered. 
                Each object in this array will have the following structure:
                - id (unique integer)
                - company_name
                - company_email
                - position
                - job_link
                - notes
                - status
                - type (e.g., onSite, remote)
                - jobType (e.g., fullTime, internship)
                - level (e.g., junior, senior)
 
                Task:
                - Analyze the provided email_content and compare it against the job_applications list to find the 
                most probable match.
                Matching Criteria:
                - Primary: Look for explicit mentions of company_name, position, or specific project/product names
                mentioned in the job_description.
                - Secondary: Check for any sender email addresses (company_email) that correspond to a company in
                 the list.
                - Tertiary: Look for context clues in the email body, such as recruiter names, interview scheduling
                 details, or references to the user's resume/application for a specific role.
                
                RESPOND ONLY with a valid JSON object. Do not include any extra text, commentary, or
                 markdown formatting like `json`.

                EMAIL CONTENT:
                """"""
                {decodedBody}
                """"""

                JOB LIST:
                {{{{JOB_LIST_JSON}}}}

                OUTPUT JSON FORMAT:
                {{
                  ""id"": ""string|null"",
                }}

                Rules:
                - Match using company name, job title, role, recruiter name, or context in the email.
                - Use the `job_id` exactly as provided in the job list.
                ";
                
                result = await model.GenerateContent(promptText);
                var newCleanedText = EmailUtilities.CleanJsonResponse(result.Text);
                
                var newAiJsonResult = JsonSerializer.Deserialize<JobMatchingPromptResult>(
                    newCleanedText,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if ( newAiJsonResult is not null )
                {
                    logger.LogInformation(
                        "An Application match was found for email {EmailId}: MatchedJobId={MatchedJobId}, category={Category}",
                        id,
                        newAiJsonResult!.Id,
                        aiJsonResult.Category
                    );
                    existingEmail.MatchedJobId = newAiJsonResult.Id;
                    existingEmail.Category = aiJsonResult.Category;
                    
                    Application? matchedApplication = await dbContext.Applications
                        .FirstOrDefaultAsync(a => a.Id == newAiJsonResult.Id && a.UserId == userId, cancellationToken);
                    
                    matchedApplication.Status = aiJsonResult.Category;
                    
                    var notificationType = EmailUtilities.MapCategoryToNotificationType(aiJsonResult.Category);
                    
                    var notificationRequestDto = new NotificationRequestDto
                    {
                        Title = "Application Match Found",
                        Message = $"An incoming email (\"{existingEmail.Subject}\") was matched to your application (ID: {newAiJsonResult.Id}). Category: {aiJsonResult.Category ?? "N/A"}.",
                        Type = notificationType, 
                        IsRead = false,
                        CreatedAt = DateTime.UtcNow
                    };

                    await notificationService.AddNotificationAsync(userId, notificationRequestDto,cancellationToken);
                }
            }
            
            existingEmail.UpdatedAt = DateTime.UtcNow;

            await Task.Delay(2000, cancellationToken);
        }
        await dbContext.SaveChangesAsync(cancellationToken);
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
            
            var emailIds = emails.OrderByDescending(e => e.InternalDate).Select(e => e.Id).ToList();
            backgroundJobClient.Enqueue(() => ProcessEmailsWithAI(emailIds, userId, CancellationToken.None));
            
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
