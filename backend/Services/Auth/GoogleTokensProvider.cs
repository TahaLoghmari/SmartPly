using System.Text.Json;
using backend.DTOs;
using backend.Entities;
using backend.Exceptions;
using backend.Settings;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace backend.Services;

public sealed class GoogleTokensProvider(
    UserManager<User> userManager,
    IOptions<GoogleSettings> googleSettings,
    ILogger<GoogleTokensProvider> logger,
    IHttpClientFactory httpClientFactory)
{
    private readonly GoogleSettings _googleSettings = googleSettings.Value;
    public async Task<GoogleTokenResponse?> ExchangeCodeForTokens(
        string? code,
        CancellationToken cancellationToken)
    {
        var clientId = _googleSettings.ClientId;
        var clientSecret = _googleSettings.ClientSecret;
        var redirectUri = _googleSettings.RedirectUri;

        using var httpClient = new HttpClient();

        var tokenRequest = new FormUrlEncodedContent(new[]
        {
            new KeyValuePair<string, string>("code", code),
            new KeyValuePair<string, string>("client_id", clientId!),
            new KeyValuePair<string, string>("client_secret", clientSecret!),
            new KeyValuePair<string, string>("redirect_uri", redirectUri!),
            new KeyValuePair<string, string>("grant_type", "authorization_code")
        });

        var response = await httpClient.PostAsync("https://oauth2.googleapis.com/token", tokenRequest,cancellationToken);
        var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var tokenResponse = JsonSerializer.Deserialize<GoogleTokenResponse>(responseContent, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
        });

        return tokenResponse!;
    }

    public async Task<GoogleUserInfo> GetGoogleUserInfo(string idToken)
    {
        var payload = await GoogleJsonWebSignature.ValidateAsync(idToken);

        return new GoogleUserInfo
        {
            Id = payload.Subject,
            Email = payload.Email,
            Name = payload.Name,
            Picture = payload.Picture,
            GivenName = payload.GivenName,
            FamilyName = payload.FamilyName
        };
    }

    public async Task StoreGoogleTokens(User user, GoogleTokenResponse tokens)
    {

        await userManager.SetAuthenticationTokenAsync(
            user,
            "Google",
            "access_token",
            tokens.AccessToken);

        if (!string.IsNullOrEmpty(tokens.RefreshToken))
        {
            await userManager.SetAuthenticationTokenAsync(
                user,
                "Google",
                "refresh_token",
                tokens.RefreshToken);
        }
    }

    public async Task<User?> FindOrCreateUserAsync(GoogleUserInfo googleUser, string? linkAccountUserId = null)
    {
        var loginInfo = new UserLoginInfo("Google", googleUser.Id, "Google");

        var user = await userManager.FindByLoginAsync(loginInfo.LoginProvider, loginInfo.ProviderKey);
        
        if (user != null) // this means a Google user already exists with this login info
        {
            if (user.Email != googleUser.Email)
            {
                user.Email = googleUser.Email;
                user.GoogleEmail = googleUser.Email;
                user.UserName = googleUser.Email;
                user.ImageUrl = googleUser.Picture;
                user.GmailConnected = true;
                await userManager.UpdateAsync(user);
            }
            return user;
        }

        user = await userManager.FindByEmailAsync(googleUser.Email);

        if (user != null) // this means a non Google user already exists with this email
        {
            var addLoginResult = await userManager.AddLoginAsync(user, loginInfo);
            if (!addLoginResult.Succeeded)
            {
                return null;
            }
            
            user.ImageUrl = googleUser.Picture;
            user.Name = googleUser.Name;
            user.GmailConnected = true;
            user.GoogleEmail = googleUser.Email;
            await userManager.UpdateAsync(user);
            return user;
        }
        /* reaching this means there's no existing user with this email or login info so now we create a new
         user */
        
        user = new User
        {
            UserName = googleUser.Email,
            Email = googleUser.Email,
            GoogleEmail = googleUser.Email,
            Name = googleUser.Name,
            ImageUrl = googleUser.Picture,
            GmailConnected = true,
            EmailConfirmed = true
        };

        var createResult = await userManager.CreateAsync(user);
        if (!createResult.Succeeded)
        {
            return null;
        }

        var linkResult = await userManager.AddLoginAsync(user, loginInfo);
        
        if (!linkResult.Succeeded)
        {
            await userManager.DeleteAsync(user);
            return null;
        }

        return user;
    }

    public async Task<User?> LinkUserAsync(
        GoogleUserInfo googleUser,
        string linkAccountUserId)
    {
        var userWithThisGoogleAccount = await userManager.FindByLoginAsync("Google", googleUser.Id);
        if ( userWithThisGoogleAccount != null)
        {
            logger.LogWarning("Google account is already linked to another user (UserId: {UserId})", userWithThisGoogleAccount.Id);
            return null; 
        }

        var userToLink = await userManager.FindByIdAsync(linkAccountUserId);
        if (userToLink is null)
        {
            logger.LogError("User to link not found. UserId: {UserId}", linkAccountUserId);
            return null;
        }
        
        var result = await userManager.AddLoginAsync(userToLink, new UserLoginInfo("Google", googleUser.Id, "Google"));
        if (!result.Succeeded)
        {
            logger.LogError("Failed to link Google account for UserId: {UserId}. Errors: {Errors}", linkAccountUserId, string.Join(", ", result.Errors.Select(e => e.Description)));
            await userManager.DeleteAsync(userToLink);
            return null;
        }
        
        userToLink.ImageUrl = googleUser.Picture;
        userToLink.GmailConnected = true;
        userToLink.GoogleEmail = googleUser.Email;
        await userManager.UpdateAsync(userToLink);

        return userToLink;
    }
    
    public async Task RevokeTokenAsync(string userId)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            logger.LogWarning("User not found for token revocation. UserId: {UserId}", userId);
            return;
        }

        var refreshToken = await userManager.GetAuthenticationTokenAsync(user, "Google", "refresh_token");

        if (refreshToken is null)
        {
            logger.LogInformation("No Google refresh token found for user {UserId}. Skipping revocation.", userId);
            return;
        }

        var client = httpClientFactory.CreateClient();
        var request = new HttpRequestMessage(HttpMethod.Post, "https://oauth2.googleapis.com/revoke")
        {
            Content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["token"] = refreshToken
            })
        };

        var response = await client.SendAsync(request);
        
        if ( !response.IsSuccessStatusCode )
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            logger.LogError("Failed to revoke Google token for user {UserId}. Status: {StatusCode}, Response: {ErrorContent}",
                userId, response.StatusCode, errorContent);
            return;
        }
        
    }
}