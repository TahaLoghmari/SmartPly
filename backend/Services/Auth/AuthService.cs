using backend.DTOs;
using backend.Entities;
using backend.Exceptions;
using backend.Mappings;
using backend.Settings;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Services;

public class AuthService(
    ILogger<AuthService> logger,
    UserManager<User> userManager,
    EmailSenderService emailSenderService,
    TokenManagementService tokenManagementService,
    CookieService cookieService,
    IConfiguration configuration,
    GoogleTokensProvider googleTokensProvider)
{
    public async Task Register(
        RegisterUserDto registerUserDto,
        HttpContext httpContext,
        IUrlHelper urlHelper
        )
    {
        logger.LogInformation("User registration attempt started for {@Email}", registerUserDto.Email);
        
        var existingUser = await userManager.FindByEmailAsync(registerUserDto.Email);
        if (existingUser != null)
        {
            logger.LogWarning("Registration failed - email already exists: {Email}.",registerUserDto.Email);
            throw new BadRequestException("Email is already in use.","Registration failed");
        }

        var user = new User
        {
            UserName = registerUserDto.Email,
            Email = registerUserDto.Email,
            Name = registerUserDto.Name,
        };

        IdentityResult result = await userManager.CreateAsync(user, registerUserDto.Password);

        if (!result.Succeeded)
        {
            logger.LogError("User registration failed for {Email}. Errors: {Errors}", 
                registerUserDto.Email, 
                string.Join(", ", result.Errors.Select(e => $"{e.Code}: {e.Description}")));
            throw new BadRequestException("User registration failed due to invalid input or duplicate email.",
                "Registration failed", 
                result.Errors
                    .GroupBy(e => e.Code)
                    .ToDictionary(
                        g => g.Key,
                        g => g.Select(e => e.Description).ToArray()
                    ));
        }
        
        logger.LogInformation("User registration successful for {Email}, UserId: {UserId}", 
            registerUserDto.Email, user.Id);

        await emailSenderService.SendConfirmationEmail(registerUserDto.Email, user, httpContext, urlHelper);
        
        logger.LogInformation("Confirmation email sent to {Email}", registerUserDto.Email);
    }
    
    public async Task Login(
        LoginUserDto loginUserDto,
        JwtAuthOptions jwtAuthOptions,
        HttpContext httpContext)
    {
        logger.LogInformation("Login attempt started for {Email}", loginUserDto.Email);

        User? user = await userManager.FindByEmailAsync(loginUserDto.Email);
        
        if ( user is null )
        {
            logger.LogWarning("Login failed - user not found for {Email}", loginUserDto.Email);
            throw new BadRequestException("Invalid email or password", "Login failed");
        }

        if (!await userManager.IsEmailConfirmedAsync(user))
        {
            logger.LogWarning("Login failed - email not confirmed for {Email}, UserId: {UserId}", 
                loginUserDto.Email, user.Id);
            throw new BadRequestException("Please confirm your email before logging in.","Email not Verified");
        }

        var result = await userManager.CheckPasswordAsync(user, loginUserDto.Password);

        if ( !result )
        {
            logger.LogWarning("Login failed - invalid password for {Email}, UserId: {UserId}", 
                loginUserDto.Email, user.Id);
            throw new BadRequestException("Invalid email or password", "Login failed");
        }
        
        AccessTokensDto tokens = await tokenManagementService.CreateAndStoreTokens(user.Id, loginUserDto.Email);

        cookieService.AddCookies(httpContext.Response, tokens, jwtAuthOptions);
        
        logger.LogInformation("Login successful for {Email}, UserId: {UserId}", 
            loginUserDto.Email, user.Id);
    }

    public async Task Refresh(
        string? refreshTokenValue,
        JwtAuthOptions jwtAuthOptions,
        HttpContext httpContext)
    {
        logger.LogInformation("Token refresh attempt started");
        
        if (string.IsNullOrEmpty(refreshTokenValue))
        {
            logger.LogWarning("Token refresh failed - refresh token missing");
            throw new UnauthorizedException("Refresh token is missing.", "Unauthorized");
        }

        AccessTokensDto? tokens = await tokenManagementService.RefreshUserTokens(refreshTokenValue);
        
        if ( tokens is null)
        {
            logger.LogWarning("Token refresh failed - invalid or expired refresh token");
            throw new UnauthorizedException("Refresh token not found or expired.", "Unauthorized");
        }
        
        cookieService.AddCookies(httpContext.Response, tokens, jwtAuthOptions);
        
        logger.LogInformation("Token refresh successful");
    }

    public string GoogleAuthorize()
    {
        logger.LogInformation("Google authorization URL requested");
        
        var clientId = configuration["Google:ClientId"];
        var redirectUri = configuration["Google:RedirectUri"]!;
        var scope = configuration["Google:Scopes"]!;
        var state = Guid.NewGuid().ToString();

        var authUrl = $"https://accounts.google.com/o/oauth2/v2/auth?" +
                      $"client_id={clientId}&" +
                      $"redirect_uri={Uri.EscapeDataString(redirectUri)}&" +
                      $"scope={Uri.EscapeDataString(scope)}&" +
                      $"response_type=code&" +
                      $"state={state}&" +
                      $"access_type=offline&" +
                      $"prompt=consent";
        
        logger.LogInformation("Google authorization URL generated with state: {State}", state);

        return authUrl;
    }

    public string GoogleLinkAuthorize(
        string? userId)
    {
        logger.LogInformation("Google account link authorization URL requested");

        if ( userId is null )
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.", "Unauthorized");
        }
        
        var clientId = configuration["Google:ClientId"];
        var redirectUri = configuration["Google:RedirectUri"]!;
        var scope = configuration["Google:Scopes"]!;
        var state = $"{userId}:{Guid.NewGuid()}";

        var authUrl = $"https://accounts.google.com/o/oauth2/v2/auth?" +
                      $"client_id={clientId}&" +
                      $"redirect_uri={Uri.EscapeDataString(redirectUri)}&" +
                      $"scope={Uri.EscapeDataString(scope)}&" +
                      $"response_type=code&" +
                      $"state={state}&" +
                      $"access_type=offline&" +
                      $"prompt=consent";
        
        logger.LogInformation("Google authorization URL generated with state: {State}", state);

        return authUrl;
    }

    public async Task<(User? user, string? error)> GoogleCallback(
        string? code,
        string? state,
        string? error,
        JwtAuthOptions jwtAuthOptions,
        HttpResponse response)
    {
        if (!string.IsNullOrEmpty(error))
            return (null, error);

        var stateParts = state?.Split(':');
        string? linkAccountUserId = stateParts?.Length == 2 ? stateParts[0] : null;

        GoogleTokenResponse? googleTokens = await googleTokensProvider.ExchangeCodeForTokens(code);
        if (googleTokens is null)
            return (null, "Failed to get tokens from Google");

        GoogleUserInfo googleUser = await googleTokensProvider.GetGoogleUserInfo(googleTokens.IdToken);

        User? user;
        AccessTokensDto? accessTokens = null;

        if (linkAccountUserId != null)
        {
            user = await googleTokensProvider.LinkUserAsync(googleUser, linkAccountUserId);
            if (user == null)
                return (null, "Failed to link Google account");
            await googleTokensProvider.StoreGoogleTokens(user, googleTokens);
        }
        else
        {
            user = await googleTokensProvider.FindOrCreateUserAsync(googleUser, null);
            if (user == null)
                return (null, "Failed to create user account");
            await googleTokensProvider.StoreGoogleTokens(user, googleTokens);
            accessTokens = await tokenManagementService.CreateAndStoreTokens(user.Id, user.Email!);
            cookieService.AddCookies(response, accessTokens, jwtAuthOptions);
        }

        return (user, null);
    }

    public async Task<UserDto> GetCurrentUser(
        string? userId)
    {
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.", "Unauthorized");
        }

        var user = await userManager.FindByIdAsync(userId);

        if (user is null)
        {
            logger.LogWarning("Get current user failed - user not found for UserId: {UserId}", userId);
            throw new NotFoundException($"No user found with ID '{userId}'.", "User not found");
        }
        
        logger.LogInformation("Current user retrieved successfully for UserId: {UserId}", userId);
        
        UserDto userDto = user.toUserDto();

        return userDto;
    }

    public async Task Logout(
        string? refreshTokenValue,
        HttpResponse response)
    {
        logger.LogInformation("Logout attempt started");

        if (!string.IsNullOrEmpty(refreshTokenValue))
        {
            await tokenManagementService.RemoveRefreshToken(refreshTokenValue);
            logger.LogInformation("Refresh token removed during logout");
        }

        cookieService.RemoveCookies(response);
        
        logger.LogInformation("Logout successful");
    }

    public async Task ConfirmEmail(string userId, string token)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            logger.LogWarning("Email confirmation failed - user not found for UserId: {UserId}", 
                userId);
            throw new BadRequestException("the UserId is invalid.", "User does not exist");
        }
        var result = await userManager.ConfirmEmailAsync(user, token);
        
        if (!result.Succeeded)
        {
            logger.LogWarning("Email confirmation failed for UserId: {UserId}. Errors: {Errors}", 
                userId, string.Join(", ", result.Errors.Select(e => $"{e.Code}: {e.Description}")));
        
            throw new BadRequestException(
                "Email confirmation failed due to invalid token or user ID.",
                "Email confirmation failed",
                result.Errors
                    .GroupBy(e => e.Code)
                    .ToDictionary(
                        g => g.Key,
                        g => g.Select(e => e.Description).ToArray()
                    )
            );
        }
        
        logger.LogInformation("Email confirmation successful for UserId: {UserId}", userId);
    }

    public async Task ResendConfirmationEmail(
        ResendConfirmationEmailDto dto,
        HttpContext httpContext,
        IUrlHelper urlHelper)

    {
        logger.LogInformation("Resend confirmation email requested for {Email}", dto.Email);

        var user = await userManager.FindByEmailAsync(dto.Email);

        if (user is null || await userManager.IsEmailConfirmedAsync(user))
        {
            logger.LogWarning(
                "Resend confirmation email failed - user not found or email already confirmed for {Email}",
                dto.Email);
            throw new BadRequestException("No user exists with the provided email or the email is already confirmed.",
                "Resend confirmation email failed");
        }

        await emailSenderService.SendConfirmationEmail(dto.Email, user, httpContext, urlHelper);

        logger.LogInformation("Confirmation email resent successfully to {Email}, UserId: {UserId}",
            dto.Email, user.Id);
    }

    public async Task ForgotPassword(
        ForgotPasswordDto dto,
        HttpContext httpContext,
        IUrlHelper urlHelper)
    {
        logger.LogInformation("Forgot password requested for {Email}", dto.Email);

        var user = await userManager.FindByEmailAsync(dto.Email);

        if (user is null)
        {
            logger.LogWarning("Forgot password failed - user not found for {Email}", dto.Email);
            throw new BadRequestException("No user exists with the provided email or the email is already confirmed.",
                "Forgot password failed");
        }
        
        await emailSenderService.SendForgotPasswordEmail(user.Email!, user, httpContext, urlHelper);
        
        logger.LogInformation("Password reset email sent to {Email}, UserId: {UserId}", 
            user.Email, user.Id);
    }

    public ResetPasswordResultDto GetResetPasswordPage(
        EmailResetPasswordDto emailResetPasswordDto)
    {
        logger.LogInformation("Password reset page requested for {Email}", emailResetPasswordDto.Email);

        var encodedToken = Uri.EscapeDataString(emailResetPasswordDto.Token);
        var encodedEmail = Uri.EscapeDataString(emailResetPasswordDto.Email);
        
        logger.LogInformation("Password reset page redirected for {Email}", emailResetPasswordDto.Email);
        
        ResetPasswordResultDto result = new()
        {
            Token = encodedToken,
            Email = encodedEmail
        };
        
        return result;
    }

    public async Task ProcessResetPassword(
        ResetPasswordDto processResetPasswordDto)
    {
        logger.LogInformation("Password reset processing for {Email}", processResetPasswordDto.Email);

        var user = await userManager.FindByEmailAsync(processResetPasswordDto.Email);
        if (user is null)
        {
            logger.LogWarning("Password reset failed - user not found for {Email}", processResetPasswordDto.Email);
            throw new BadRequestException("No user exists with the provided email.",
                "Password reset failed");
        }

        var result = await userManager.ResetPasswordAsync(user, processResetPasswordDto.Token, processResetPasswordDto.NewPassword);

        if (!result.Succeeded)
        {
            logger.LogWarning("Password reset failed for {Email}, UserId: {UserId}. Errors: {Errors}", 
                user.Email, user.Id, 
                string.Join(", ", result.Errors.Select(e => $"{e.Code}: {e.Description}")));
            
            throw new BadRequestException("Password reset failed due to invalid token or user ID.",
                "Password reset failed",
                result.Errors
                    .GroupBy(e => e.Code)
                    .ToDictionary(
                        g => g.Key,
                        g => g.Select(e => e.Description).ToArray()
                    ));
        }
        
        logger.LogInformation("Password reset successful for {Email}, UserId: {UserId}", 
            user.Email, user.Id);
    }
}