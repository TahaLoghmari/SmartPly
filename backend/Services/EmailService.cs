using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Microsoft.AspNetCore.Identity;
using backend.DTOs;
using backend.Entities;
using backend.Exceptions;
using backend.Settings;
using backend.Mappings;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
using Google.Apis.Util.Store;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

namespace backend.Services;

public class EmailService(
    UserManager<User> userManager,
    IOptions<GoogleSettings> googleSettings,
    ILogger<EmailService> logger,
    ApplicationDbContext dbContext,
    IMemoryCache cache,
    CacheService cacheService)
{
    private readonly GoogleSettings _googleSettings = googleSettings.Value;
    private GmailService? _gmailService;
    
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
        
        var listRequest = _gmailService!.Users.Messages.List("me");
        listRequest.MaxResults = 200;
        var listResponse = await listRequest.ExecuteAsync(cancellationToken);

        var messages = new List<Message>();

        if (listResponse.Messages is not null && listResponse.Messages.Any())
        {
            var tasks = listResponse.Messages.Select(message =>
            {
                var getRequest = _gmailService.Users.Messages.Get("me", message.Id);
                getRequest.Format = UsersResource.MessagesResource.GetRequest.FormatEnum.Full;
                return getRequest.ExecuteAsync(cancellationToken);
            });

            var fetchedMessages = await Task.WhenAll(tasks);
            messages.AddRange(fetchedMessages);
        }
        
        var emails = messages.Select(msg => EmailMappings.MapToEmailEntity(msg, userId)).ToList();
    
        await dbContext.Emails.AddRangeAsync(emails, cancellationToken);
        
        var profile = await _gmailService.Users.GetProfile("me").ExecuteAsync(cancellationToken);
        user.LastHistoryId = profile.HistoryId;
        user.LastSyncedAt = DateTime.UtcNow;
        user.IsInitialSyncComplete = true;
        
        await userManager.UpdateAsync(user);
        await dbContext.SaveChangesAsync(cancellationToken);
        
        cacheService.InvalidateUserEmailCache(userId);
    }
    
    private async Task ProcessNewMessages(
        IList<HistoryMessageAdded> messagesAdded,
        string userId,
        CancellationToken cancellationToken)
    {
        if (!messagesAdded.Any()) return;

        var messages = new List<Message>();

        var tasks = messagesAdded.Select(async messageAdded =>
        {
            var getRequest = _gmailService!.Users.Messages.Get("me", messageAdded.Message.Id);
            getRequest.Format = UsersResource.MessagesResource.GetRequest.FormatEnum.Full;
            return await getRequest.ExecuteAsync(cancellationToken);
        });

        var fetchedMessages = await Task.WhenAll(tasks);
        messages.AddRange(fetchedMessages);

        var emails = messages.Select(msg => EmailMappings.MapToEmailEntity(msg, userId)).ToList();
    
        await dbContext.Emails.AddRangeAsync(emails, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Processed {Count} new messages for user {UserId}", emails.Count, userId);
    }
    
    private async Task ProcessDeletedMessages(
        IList<HistoryMessageDeleted> messagesDeleted,
        string userId,
        CancellationToken cancellationToken)
    {
        if (!messagesDeleted.Any()) return;

        var messageIds = messagesDeleted.Select(md => md.Message.Id).ToList();

        var emailsToDelete = await dbContext.Emails
            .Where(e => e.UserId == userId && messageIds.Contains(e.Id))
            .ToListAsync(cancellationToken);

        if (emailsToDelete.Any())
        {
            dbContext.Emails.RemoveRange(emailsToDelete);
            await dbContext.SaveChangesAsync(cancellationToken);

            logger.LogInformation("Processed {Count} deleted messages for user {UserId}", emailsToDelete.Count, userId);
        }
    }
    
    private async Task PerformHistoryBasedSync(User user, string userId, CancellationToken cancellationToken)
    {
        var historyRequest = _gmailService!.Users.History.List("me");
        historyRequest.StartHistoryId = user.LastHistoryId;
        historyRequest.MaxResults = 100;

        var historyResponse = await historyRequest.ExecuteAsync(cancellationToken);

        if (historyResponse.History != null)
        {
            foreach (var historyRecord in historyResponse.History)
            {
                if (historyRecord.MessagesAdded != null)
                {
                    await ProcessNewMessages(historyRecord.MessagesAdded, userId, cancellationToken);
                }

                if (historyRecord.MessagesDeleted != null)
                {
                    await ProcessDeletedMessages(historyRecord.MessagesDeleted, userId, cancellationToken);
                }
            }
        }

        user.LastHistoryId = historyResponse.HistoryId;
        user.LastSyncedAt = DateTime.UtcNow;
        await userManager.UpdateAsync(user);
    }
    
    private async Task UpsertMessages(List<Message> messages, string userId, CancellationToken cancellationToken)
    {
        if (!messages.Any()) return;

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
                EmailMappings.UpdateEmailEntity(existingEmail, email);
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
    }
    
    private async Task PerformDateBasedSync(User user, string userId, CancellationToken cancellationToken)
    {
        var lastSyncTimestamp = user.LastSyncedAt?.ToUniversalTime() ?? DateTime.UtcNow.AddDays(-30).ToUniversalTime();
        var unixTimestamp = ((DateTimeOffset)lastSyncTimestamp).ToUnixTimeSeconds();

        var listRequest = _gmailService!.Users.Messages.List("me");
        listRequest.Q = $"after:{unixTimestamp}";
        listRequest.MaxResults = 500;

        var messages = new List<Message>();
        string? nextPageToken = null;

        do
        {
            listRequest.PageToken = nextPageToken;
            var listResponse = await listRequest.ExecuteAsync(cancellationToken);

            if (listResponse.Messages != null && listResponse.Messages.Any())
            {
                var tasks = listResponse.Messages.Select(async message =>
                {
                    var getRequest = _gmailService.Users.Messages.Get("me", message.Id);
                    getRequest.Format = UsersResource.MessagesResource.GetRequest.FormatEnum.Full;
                    return await getRequest.ExecuteAsync(cancellationToken);
                });

                var fetchedMessages = await Task.WhenAll(tasks);
                messages.AddRange(fetchedMessages);
            }

            nextPageToken = listResponse.NextPageToken;
        } while (!string.IsNullOrEmpty(nextPageToken));

        await UpsertMessages(messages, userId, cancellationToken);

        var profile = await _gmailService.Users.GetProfile("me").ExecuteAsync(cancellationToken);
        user.LastHistoryId = profile.HistoryId;
        user.LastSyncedAt = DateTime.UtcNow;
        await userManager.UpdateAsync(user);

        logger.LogInformation("Date-based sync completed for user {UserId}. Processed {Count} messages", userId, messages.Count);
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
        
        try
        {
            await PerformHistoryBasedSync(user, userId, cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "History-based sync failed for user {UserId}, falling back to date-based sync", userId);
            await PerformDateBasedSync(user, userId, cancellationToken);
        }
        
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
            return cachedResult;
        }
        
        logger.LogDebug("Cache miss for emails query: {CacheKey}", cacheKey);

        IQueryable<Email> emailQuery = dbContext.Emails
            .AsNoTracking()
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.InternalDate);
        
        var paginationResult = await PaginationResultDto<Email>.CreateAsync(
            emailQuery, query.Page ?? 1, query.PageSize ?? 8,cancellationToken);
        
        cacheService.CacheEmailsResult(cacheKey, paginationResult, userId);
        
        return paginationResult;
    }
    
    public async Task<Email> GetEmailByIdAsync(
        string? id,
        string? userId,
        CancellationToken cancellationToken)
    {
        if (id == string.Empty || id is null )
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
        
        Email? email = await dbContext.Emails
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId,cancellationToken);

        if (email is null)
        {
            logger.LogWarning("Get current email failed - email not found for Id: {emailId}", id);
            throw new NotFoundException($"No email found with ID '{id}'.");
        }
        
        logger.LogInformation("email Retrieved with ID {emailId}", email.Id);
        
        return email;
    }
    
    

}
