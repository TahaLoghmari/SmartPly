using System.Text;
using System.Text.Json;
using backend.Controllers;
using backend.DTOs;
using backend.Entities;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
using Google.Apis.Services;
using Microsoft.AspNetCore.Identity;

namespace backend.Services;

public sealed class GmailProvider(
    UserManager<User> userManager,
    IConfiguration configuration,
    IHttpClientFactory httpClientFactory,
    ILogger<GmailController> logger
)
{
    public async Task<string?> GetAuthenticationTokenAsync(User user)
    {
        var accessToken = await userManager.GetAuthenticationTokenAsync(user, "Google", "access_token");
        var expiresAtStr = await userManager.GetAuthenticationTokenAsync(user, "Google", "expires_at");

        if (!string.IsNullOrEmpty(accessToken) && !string.IsNullOrEmpty(expiresAtStr))
        {
            if (DateTime.TryParse(expiresAtStr, out var expiresAt))
            {
                var bufferTimespan = TimeSpan.FromMinutes(5);
                var currentTimeWithBuffer = DateTime.UtcNow.Add(bufferTimespan);

                if (expiresAt > currentTimeWithBuffer)
                {
                    logger.LogInformation("Using existing valid Google token that expires at {ExpiryTime}", expiresAt);
                    return accessToken;
                }

                logger.LogInformation("Google token expired or about to expire at {ExpiryTime}, refreshing", expiresAt);
            }
        }

        var refreshToken = await userManager.GetAuthenticationTokenAsync(user, "Google", "refresh_token");
        if (string.IsNullOrEmpty(refreshToken))
        {
            logger.LogWarning("No refresh token found for user {UserId}", user.Id);
            return null;
        }

        var newTokens = await RefreshGoogleTokenAsync(refreshToken);
        if (newTokens != null)
        {
            await userManager.SetAuthenticationTokenAsync(user, "Google", "access_token", newTokens.AccessToken);

            var newExpiresAt = DateTime.UtcNow.AddSeconds(newTokens.ExpiresIn);
            await userManager.SetAuthenticationTokenAsync(user, "Google", "expires_at", newExpiresAt.ToString("O"));

            logger.LogInformation("Successfully refreshed Google token, new expiry at {ExpiryTime}", newExpiresAt);
            return newTokens.AccessToken;
        }

        return null;
    }

    private async Task<GoogleTokenResponse?> RefreshGoogleTokenAsync(string refreshToken)
    {
        var clientId = configuration["Google:ClientId"];
        var clientSecret = configuration["Google:ClientSecret"];

        if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
        {
            logger.LogError("Missing Google Client ID or Client Secret in configuration");
            return null;
        }

        using var httpClient = httpClientFactory.CreateClient();
        httpClient.Timeout = TimeSpan.FromSeconds(30);

        var tokenRequest = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("client_id", clientId),
            new KeyValuePair<string, string>("client_secret", clientSecret),
            new KeyValuePair<string, string>("refresh_token", refreshToken),
            new KeyValuePair<string, string>("grant_type", "refresh_token")
        });

        logger.LogInformation("Attempting to refresh Google access token");
        var response = await httpClient.PostAsync("https://oauth2.googleapis.com/token", tokenRequest);

        var responseContent = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            logger.LogError("Failed to refresh Google token: Status {StatusCode}, Response: {ErrorContent}",
                response.StatusCode, responseContent);
            return null;
        }

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            PropertyNameCaseInsensitive = true
        };

        var tokenResponse = JsonSerializer.Deserialize<GoogleTokenResponse>(responseContent, options);

        if (tokenResponse == null || string.IsNullOrEmpty(tokenResponse.AccessToken))
        {
            logger.LogError("Received invalid token response from Google");
            return null;
        }

        logger.LogInformation("Successfully refreshed Google access token");
        return tokenResponse;
    }

    public async Task<List<EmailMessageDto>> GetGmailMessages(string accessToken)
    {
        var credential = GoogleCredential.FromAccessToken(accessToken)
            .CreateScoped(GmailService.Scope.GmailReadonly);

        var service = new GmailService(new BaseClientService.Initializer
        {
            HttpClientInitializer = credential,
            ApplicationName = "SmartPly"
        });

        var messageListRequest = service.Users.Messages.List("me");
        messageListRequest.MaxResults = 10;
        var messageList = await messageListRequest.ExecuteAsync();

        if (messageList.Messages == null || !messageList.Messages.Any())
        {
            logger.LogInformation("No messages found in Gmail account");
            return new List<EmailMessageDto>();
        }

        var emails = new List<EmailMessageDto>();

        foreach (var messageRef in messageList.Messages)
        {
            var messageRequest = service.Users.Messages.Get("me", messageRef.Id);
            var message = await messageRequest.ExecuteAsync();

            string subject = GetHeader(message.Payload.Headers, "Subject");
            string from = GetHeader(message.Payload.Headers, "From");
            string date = GetHeader(message.Payload.Headers, "Date");

            var email = new EmailMessageDto
            {
                Id = message.Id,
                Subject = subject,
                From = from,
                Date = date,
                Snippet = message.Snippet ?? string.Empty
            };

            string body = string.Empty;
            if (message.Payload.Parts != null)
            {
                foreach (var part in message.Payload.Parts)
                {
                    if (part.MimeType == "text/plain" && !string.IsNullOrEmpty(part.Body.Data))
                    {
                        body = DecodeBase64UrlSafe(part.Body.Data);
                        break;
                    }
                }
            }
            else if (message.Payload.Body?.Data != null)
            {
                body = DecodeBase64UrlSafe(message.Payload.Body.Data);
            }

            email.Body = body;
            emails.Add(email);
        }

        return emails;
    }

    private string GetHeader(IList<MessagePartHeader> headers, string headerName)
    {
        return headers?.FirstOrDefault(h =>
            string.Equals(h.Name, headerName, StringComparison.OrdinalIgnoreCase))?.Value ?? string.Empty;
    }

    private string DecodeBase64UrlSafe(string base64UrlSafe)
    {
        if (string.IsNullOrEmpty(base64UrlSafe))
        {
            return string.Empty;
        }

        string base64 = base64UrlSafe.Replace('-', '+').Replace('_', '/');
        switch (base64.Length % 4)
        {
            case 2: base64 += "=="; break;
            case 3: base64 += "="; break;
        }

        byte[] bytes = Convert.FromBase64String(base64);
        return Encoding.UTF8.GetString(bytes);
    }
}