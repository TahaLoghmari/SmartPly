using backend.DTOs;
using backend.DTOs.Auth;
using backend.DTOs.Email;
using backend.Entities;
using backend.Mappings;
using backend.Services;
using backend.Settings;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("auth")]
public sealed class AuthController(
    UserManager<User> userManager,
    IOptions<JwtAuthOptions> options,
    IConfiguration configuration,
    GoogleTokensProvider googleTokensProvider,
    TokenManagementService tokenManagementService,
    CookieService cookieService,
    EmailSenderService emailSenderService,
    ILogger<AuthController> logger) : ControllerBase
{
    private readonly JwtAuthOptions _jwtAuthOptions = options.Value;

    [HttpPost("register")]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register(
        RegisterUserDto registerUserDto,
        IValidator<RegisterUserDto> validator,
        ProblemDetailsFactory problemDetailsFactory)
    {
        logger.LogInformation("User registration attempt started for {@Email}", registerUserDto.Email);
        
        await validator.ValidateAndThrowAsync(registerUserDto);
        
        var existingUser = await userManager.FindByEmailAsync(registerUserDto.Email);
        if (existingUser != null)
        {
            logger.LogWarning("Registration failed - email already exists: {Email}.",registerUserDto.Email);
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status400BadRequest,
                title: "Registration failed",
                detail: "Email is already in use."
            );
            return BadRequest(problem);
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
            
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status400BadRequest,
                title: "Registration failed",
                detail: "User registration failed due to invalid input or duplicate email."
            );
            problem.Extensions.Add("errors", result.Errors.Select(e => new { e.Code, e.Description }));
            return BadRequest(problem);
        }
        
        logger.LogInformation("User registration successful for {Email}, UserId: {UserId}", 
            registerUserDto.Email, user.Id);

        await emailSenderService.SendConfirmationEmail(registerUserDto.Email, user, HttpContext, Url);
        
        logger.LogInformation("Confirmation email sent to {Email}", registerUserDto.Email);
        
        return Ok(new { message = "Registration successful" });
    }
    [HttpPost("login")]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Login(
        LoginUserDto loginUserDto,
        IValidator<LoginUserDto> validator,
        ProblemDetailsFactory problemDetailsFactory)
    {
        logger.LogInformation("Login attempt started for {Email}", loginUserDto.Email);
        
        await validator.ValidateAndThrowAsync(loginUserDto);

        User? user = await userManager.FindByEmailAsync(loginUserDto.Email);
        
        if ( user is null )
        {
            logger.LogWarning("Login failed - user not found for {Email}", loginUserDto.Email);
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status400BadRequest,
                title: "Login failed",
                detail: "Invalid email."
            );
            return BadRequest(problem);
        }

        if (!await userManager.IsEmailConfirmedAsync(user))
        {
            logger.LogWarning("Login failed - email not confirmed for {Email}, UserId: {UserId}", 
                loginUserDto.Email, user.Id);
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status400BadRequest,
                title: "Email not Verified",
                detail: "Please confirm your email before logging in."
            );
            return BadRequest(problem);
        }

        var result = await userManager.CheckPasswordAsync(user, loginUserDto.Password);

        if ( !result )
        {
            logger.LogWarning("Login failed - invalid password for {Email}, UserId: {UserId}", 
                loginUserDto.Email, user.Id);
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status400BadRequest,
                title: "Login failed",
                detail: "Invalid email or password."
            );
            return BadRequest(problem);
        }
        
        AccessTokensDto tokens = await tokenManagementService.CreateAndStoreTokens(user.Id, loginUserDto.Email);

        cookieService.AddCookies(Response, tokens, _jwtAuthOptions);
        
        logger.LogInformation("Login successful for {Email}, UserId: {UserId}", 
            loginUserDto.Email, user.Id);

        return Ok(new { message = "Login successful" });
    }

    [HttpPost("refresh")]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Refresh( [FromServices] ProblemDetailsFactory problemDetailsFactory)
    {
        logger.LogInformation("Token refresh attempt started");
        
        var refreshTokenValue = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshTokenValue))
        {
            logger.LogWarning("Token refresh failed - refresh token missing");
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status401Unauthorized,
                title: "Unauthorized",
                detail: "Refresh token is missing."
            );
            return Unauthorized(problem);
        }

        AccessTokensDto? tokens = await tokenManagementService.RefreshUserTokens(refreshTokenValue);
        
        if ( tokens is null)
        {
            logger.LogWarning("Token refresh failed - invalid or expired refresh token");
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status401Unauthorized,
                title: "Unauthorized",
                detail: "Refresh token not found or expired."
            );
            return Problem(problem.Detail, statusCode: problem.Status, title: problem.Title);
        }
        
        cookieService.AddCookies(Response, tokens, _jwtAuthOptions);
        
        logger.LogInformation("Token refresh successful");
        
        return Ok(new { message = "Token refreshed successfully" });
    }
    
    [HttpGet("google/authorize")]
    public IActionResult GoogleAuthorize()
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

        return Ok(new { authorizationUrl = authUrl });
    }
    
    [HttpGet("google/link")]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public IActionResult GoogleLinkAuthorize(
        ProblemDetailsFactory problemDetailsFactory)
    {
        logger.LogInformation("Google account link authorization URL requested");
        
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            if (string.IsNullOrEmpty(userId))
            {
                logger.LogWarning("Get current user failed - user ID claim missing");
                var problem = problemDetailsFactory.CreateProblemDetails(
                    HttpContext,
                    StatusCodes.Status401Unauthorized,
                    title: "Unauthorized",
                    detail: "User ID claim is missing."
                );
                return Unauthorized(problem);
            }
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

        return Ok(new { authorizationUrl = authUrl });
    }

    [HttpGet("google/callback")]
    public async Task<IActionResult> GoogleCallback(
        [FromQuery] GoogleCallbackDto googleCallbackDto,
        IValidator<GoogleCallbackDto> validator)
    {
        string[] stateParts = googleCallbackDto!.state!.Split(':');
        string? linkAccountUserId = stateParts.Length == 2 ? stateParts[0] : null;
        
        if (!string.IsNullOrEmpty(googleCallbackDto.error))
        {
            logger.LogWarning("Google OAuth flow was canceled or resulted in an error: {Error}", googleCallbackDto.error);
            var errorMessage = "The Google authentication process was canceled.";
            string redirectPath = linkAccountUserId != null ? "/app" : "/login";
            return Redirect($"{configuration["Frontend:BaseUrl"]!}{redirectPath}?type=google_canceled&message={Uri.EscapeDataString(errorMessage)}");
        }
        
        logger.LogInformation("Google callback received with state: {State}", googleCallbackDto.state);
        
        await validator.ValidateAndThrowAsync(googleCallbackDto);

        GoogleTokenResponse? tokens = await googleTokensProvider.ExchangeCodeForTokens(googleCallbackDto.code);
        
        if (tokens is null)
        {
            logger.LogError("Failed to exchange Google authorization code for tokens");
            return Redirect($"{configuration["Frontend:BaseUrl"]!}/auth?type=token_exchange&message={Uri.EscapeDataString("Failed to get tokens from Google")}");
        }
        
        GoogleUserInfo googleUser = await googleTokensProvider.GetGoogleUserInfo(tokens.IdToken);

        User? user;

        if (linkAccountUserId != null)
        {
            user = await googleTokensProvider.LinkUserAsync(googleUser,linkAccountUserId);
            if ( user is null )
            {
                logger.LogError("Failed to link user from Google information for email: {Email}", 
                    googleUser?.Email);
                return Redirect($"{configuration["Frontend:BaseUrl"]!}/app?type=link_failed&message={Uri.EscapeDataString("Failed to link Google account")}");
            }
            await googleTokensProvider.StoreGoogleTokens(user, tokens);
            logger.LogInformation("Google account linking successful for {Email}, UserId: {UserId}", 
                user.Email, user.Id);
        }
        else
        {
            user = await googleTokensProvider.FindOrCreateUserAsync(googleUser,linkAccountUserId);
            if ( user is null )
            {
                logger.LogError("Failed to find or create user from Google information for email: {Email}", 
                    googleUser?.Email);
                return Redirect($"{configuration["Frontend:BaseUrl"]!}/auth?type=user_creation&message={Uri.EscapeDataString("Failed to create user account")}");
            }
            await googleTokensProvider.StoreGoogleTokens(user, tokens);
            
            AccessTokensDto accessTokens = await tokenManagementService.CreateAndStoreTokens(user.Id, user.Email!);
        
            cookieService.AddCookies(Response, accessTokens, _jwtAuthOptions);
            
            logger.LogInformation("Google login successful for {Email}, UserId: {UserId}", 
                user.Email, user.Id);
        }
        
        return Redirect($"{configuration["Frontend:BaseUrl"]!}/app");
    }

    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType<UserDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetCurrentUser(
        ProblemDetailsFactory problemDetailsFactory)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status401Unauthorized,
                title: "Unauthorized",
                detail: "User ID claim is missing."
            );
            return Unauthorized(problem);
        }

        var user = await userManager.FindByIdAsync(userId);

        if (user is null)
        {
            logger.LogWarning("Get current user failed - user not found for UserId: {UserId}", userId);
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status404NotFound,
                title: "User not found",
                detail: $"No user found with ID '{userId}'."
            );
            return NotFound(problem);
        }
        
        logger.LogInformation("Current user retrieved successfully for UserId: {UserId}", userId);
        
        var userDto = user.toUserDto();

        return Ok(userDto);
    }
    
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        logger.LogInformation("Logout attempt started");
        
        var refreshTokenValue = Request.Cookies["refreshToken"];

        if (!string.IsNullOrEmpty(refreshTokenValue))
        {
            await tokenManagementService.RemoveRefreshToken(refreshTokenValue);
            logger.LogInformation("Refresh token removed during logout");
        }

        cookieService.RemoveCookies(Response);
        
        logger.LogInformation("Logout successful");

        return Ok(new { message = "Logged out successfully" });
    }
    [HttpGet("confirm-email")]
    [AllowAnonymous]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ConfirmEmail(
        [FromQuery] ConfirmationDto confirmationDto,
        ProblemDetailsFactory problemDetailsFactory,
        IValidator<ConfirmationDto> validator)
    {
        logger.LogInformation("Email confirmation attempt for UserId: {UserId}", confirmationDto.UserId);
        
        await validator.ValidateAndThrowAsync(confirmationDto);

        var user = await userManager.FindByIdAsync(confirmationDto.UserId);
        if (user is null)
        {
            logger.LogWarning("Email confirmation failed - user not found for UserId: {UserId}", 
                confirmationDto.UserId);
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status400BadRequest,
                title: "User does not exist",
                detail: "the UserId is invalid."
            );
            return BadRequest(problem);
        }

        var result = await userManager.ConfirmEmailAsync(user, confirmationDto.Token);
        var frontendUrl = configuration["Frontend:BaseUrl"];
        
        if (result.Succeeded)
        {
            logger.LogInformation("Email confirmation successful for UserId: {UserId}, Email: {Email}", 
                user.Id, user.Email);
            return Redirect($"{frontendUrl}/email-confirmed?status=success");
        }
        
        logger.LogWarning("Email confirmation failed for UserId: {UserId}, Email: {Email}. Errors: {Errors}", 
            user.Id, user.Email, 
            string.Join(", ", result.Errors.Select(e => $"{e.Code}: {e.Description}")));
        
        return Redirect($"{frontendUrl}/email-confirmed?status=error");
    }
    
    [AllowAnonymous]
    [HttpPost("resend-confirmation-email")]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResendConfirmationEmail( 
        ResendConfirmationEmailDto dto,
        ProblemDetailsFactory problemDetailsFactory,
        IValidator<ResendConfirmationEmailDto> validator)
    {
        logger.LogInformation("Resend confirmation email requested for {Email}", dto.Email);
        
        await validator.ValidateAndThrowAsync(dto);
        
        var user = await userManager.FindByEmailAsync(dto.Email);

        if (user is null || await userManager.IsEmailConfirmedAsync(user))
        {
            logger.LogWarning("Resend confirmation email failed - user not found or email already confirmed for {Email}", 
                dto.Email);
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status400BadRequest,
                title: "User not found",
                detail: "No user exists with the provided email or the email is already confirmed."
            );
            return BadRequest(problem);
        }

        await emailSenderService.SendConfirmationEmail(dto.Email, user, HttpContext, Url);
        
        logger.LogInformation("Confirmation email resent successfully to {Email}, UserId: {UserId}", 
            dto.Email, user.Id);

        return Ok(new { message = "Confirmation email sent. Please check your inbox." });
    }
    [HttpPost("forgot-password")]
    [AllowAnonymous]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ForgotPassword(
        ForgotPasswordDto dto,
        ProblemDetailsFactory problemDetailsFactory,
        IValidator<ForgotPasswordDto> validator)
    {
        logger.LogInformation("Forgot password requested for {Email}", dto.Email);
            
        await validator.ValidateAndThrowAsync(dto);

        var user = await userManager.FindByEmailAsync(dto.Email);

        if (user is null)
        {
            logger.LogWarning("Forgot password failed - user not found for {Email}", dto.Email);
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status400BadRequest,
                title: "User not found",
                detail: "No user exists with the provided email or the email is already confirmed."
            );
            return BadRequest(problem);
        }
        
        await emailSenderService.SendForgotPasswordEmail(user.Email!, user, HttpContext, Url);
        
        logger.LogInformation("Password reset email sent to {Email}, UserId: {UserId}", 
            user.Email, user.Id);
        
        return Ok(new { message = "Reset Password email sent. Please check your inbox." });
    }
    [HttpGet("reset-password")]
    [AllowAnonymous]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword(
    [FromQuery] EmailResetPasswordDto emailResetPasswordDto,
    IValidator<EmailResetPasswordDto> validator)
    {
        logger.LogInformation("Password reset page requested for {Email}", emailResetPasswordDto.Email);
        
        var frontendUrl = configuration["Frontend:BaseUrl"];

        var validationResult = await validator.ValidateAsync(emailResetPasswordDto);
        if (!validationResult.IsValid)
        {
            logger.LogWarning("Password reset validation failed for {Email}. Errors: {Errors}", 
                emailResetPasswordDto.Email, 
                string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)));
            
            return Redirect($"{frontendUrl}/reset-password?status=invalid");
        }

        var encodedToken = Uri.EscapeDataString(emailResetPasswordDto.Token);
        var encodedEmail = Uri.EscapeDataString(emailResetPasswordDto.Email);
        
        logger.LogInformation("Password reset page redirected for {Email}", emailResetPasswordDto.Email);
        
        return Redirect($"{frontendUrl}/reset-password?token={encodedToken}&email={encodedEmail}");
    }
    [HttpPost("reset-password")]
    [AllowAnonymous]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword(
    ResetPasswordDto processResetPasswordDto,
    ProblemDetailsFactory problemDetailsFactory,
    IValidator<ResetPasswordDto> validator)
    {
        logger.LogInformation("Password reset processing for {Email}", processResetPasswordDto.Email);
        
        await validator.ValidateAndThrowAsync(processResetPasswordDto);

        var user = await userManager.FindByEmailAsync(processResetPasswordDto.Email);
        if (user is null)
        {
            logger.LogWarning("Password reset failed - user not found for {Email}", processResetPasswordDto.Email);
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status400BadRequest,
                title: "User not found",
                detail: "No user exists with the provided email."
            );
            return BadRequest(problem);
        }

        var result = await userManager.ResetPasswordAsync(user, processResetPasswordDto.Token, processResetPasswordDto.NewPassword);
        var frontendUrl = configuration["Frontend:BaseUrl"];

        if (result.Succeeded)
        {
            logger.LogInformation("Password reset successful for {Email}, UserId: {UserId}", 
                user.Email, user.Id);
            return Redirect($"{frontendUrl}/reset-password?status=success");
        }
        
        logger.LogWarning("Password reset failed for {Email}, UserId: {UserId}. Errors: {Errors}", 
            user.Email, user.Id, 
            string.Join(", ", result.Errors.Select(e => $"{e.Code}: {e.Description}")));
        
        var resetFailedProblem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status400BadRequest,
                title: "Password Reset Failed",
                detail: "The password reset token is invalid or has expired."
            );
        return BadRequest(resetFailedProblem);
    }
}