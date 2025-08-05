using System.Text.Json;
using backend.DTOs;
using backend.Entities;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;

namespace backend.Services;

public sealed class GoogleTokensProvider(
    UserManager<User> userManager,
    IConfiguration configuration,
    ILogger<GoogleTokensProvider> logger)
{
    public async Task<GoogleTokenResponse?> ExchangeCodeForTokens(
        string? code,
        CancellationToken cancellationToken)
    {
        var clientId = configuration["Google:ClientId"];
        var clientSecret = configuration["Google:ClientSecret"];
        var redirectUri = configuration["Google:RedirectUri"];

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
        var expiresAt = DateTime.UtcNow.AddSeconds(tokens.ExpiresIn).ToString("o");
            await userManager.SetAuthenticationTokenAsync(
                user,
                "Google",
                "expires_at",
                expiresAt);
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
}