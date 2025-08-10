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
        listRequest.MaxResults = 100;
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
        
        await dbContext.SaveChangesAsync(cancellationToken);
        
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
