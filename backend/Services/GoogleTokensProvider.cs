using System.Text.Json;
using backend.DTOs;
using backend.Entities;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;

namespace backend.Services;

public sealed class GoogleTokensProvider(UserManager<User> userManager, IConfiguration configuration)
{
    public async Task<GoogleTokenResponse?> ExchangeCodeForTokens(string code)
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

        var response = await httpClient.PostAsync("https://oauth2.googleapis.com/token", tokenRequest);
        var responseContent = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var tokenResponse = JsonSerializer.Deserialize<GoogleTokenResponse>(responseContent, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
        });

        Console.WriteLine($"Access Token: {tokenResponse?.AccessToken}");
        Console.WriteLine($"ID Token: {tokenResponse?.IdToken}");
        Console.WriteLine($"Refresh Token: {tokenResponse?.RefreshToken}");

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

    public async Task<User?> FindOrCreateUser(GoogleUserInfo googleUser)
    {
        var loginInfo = new UserLoginInfo("Google", googleUser.Id, "Google");

        var user = await userManager.FindByLoginAsync(loginInfo.LoginProvider, loginInfo.ProviderKey);

        if (user != null)
        {
            if (user.Email != googleUser.Email)
            {
                user.Email = googleUser.Email;
                user.UserName = googleUser.Email;
                user.ImageUrl = googleUser.Picture;
                user.GmailConnected = true;
                await userManager.UpdateAsync(user);
            }
            return user;
        }

        user = await userManager.FindByEmailAsync(googleUser.Email);

        if (user != null)
        {
            var addLoginResult = await userManager.AddLoginAsync(user, loginInfo);
            if (!addLoginResult.Succeeded)
            {
                return null;
            }
            
            user.ImageUrl = googleUser.Picture;
            user.Name = googleUser.Name;
            user.GmailConnected = true;
            await userManager.UpdateAsync(user);
            return user;
        }

        user = new User
        {
            UserName = googleUser.Email,
            Email = googleUser.Email,
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
}