using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using backend.DTOs;
using backend.Entities;
using backend.Exceptions;
using backend.Settings;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
using Google.Apis.Util.Store;
using Microsoft.Extensions.Options;

namespace backend.Services;

public class GmailClientProvider(
    UserManager<User> userManager,
    IOptions<GoogleSettings> googleSettings,
    ILogger<GmailClientProvider> logger)
{
    private readonly GoogleSettings _googleSettings = googleSettings.Value;
    private GmailService? _gmailService;
    
    public async Task InitializeAsync(
        ClaimsPrincipal userClaims,
        CancellationToken cancellationToken)
    {
        var user = await userManager.GetUserAsync(userClaims);
        if (user is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }

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
    
    public async Task<PaginatedMessageResponse> GetLatestEmailsAsync(
        CancellationToken cancellationToken,
        string? pageToken)
    {
        var listRequest = _gmailService!.Users.Messages.List("me");
        listRequest.MaxResults = 7;
        listRequest.PageToken = pageToken;
        var listResponse = await listRequest.ExecuteAsync(cancellationToken);

        var messages = new List<Message>();

        if (listResponse.Messages is not null && listResponse.Messages.Any())
        {
            var tasks = listResponse.Messages.Select(message =>
            {
                var getRequest = _gmailService.Users.Messages.Get("me", message.Id);
                getRequest.Format = UsersResource.MessagesResource.GetRequest.FormatEnum.Metadata;
                return getRequest.ExecuteAsync(cancellationToken);
            });

            var fetchedMessages = await Task.WhenAll(tasks);
            messages.AddRange(fetchedMessages);
        }
        
        var sortedMessages = messages.OrderByDescending(m => m.InternalDate).ToList();

        return new PaginatedMessageResponse
        {
            Messages = sortedMessages,
            NextPageToken = listResponse.NextPageToken
        };
    }
    
    public async Task<Message> GetEmailByIdAsync(
        string emailId,
        CancellationToken cancellationToken)
    {
        var getRequest = _gmailService.Users.Messages.Get("me", emailId);
        getRequest.Format = UsersResource.MessagesResource.GetRequest.FormatEnum.Full;
        var message = await getRequest.ExecuteAsync(cancellationToken);
        return message;
    }

}
