using backend.DTOs;
using backend.Services;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[Route("auth")]
[EnableRateLimiting("fixed")]
public sealed class AuthController(
    IConfiguration configuration,
    AuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterUserDto registerUserDto,
        IValidator<RegisterUserDto> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(registerUserDto,cancellationToken);
        
        await authService.Register(registerUserDto,HttpContext, Url);
        
        return NoContent();
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginUserDto loginUserDto,
        IValidator<LoginUserDto> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(loginUserDto,cancellationToken);
        
        await authService.Login(loginUserDto,HttpContext,cancellationToken);

        return NoContent();
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(
        CancellationToken cancellationToken)
    {
        var refreshTokenValue = Request.Cookies["refreshToken"];

        await authService.Refresh(refreshTokenValue, HttpContext,cancellationToken);
        
        return NoContent();
    }
    
    [HttpGet("google/authorize")]
    public IActionResult GoogleAuthorize()
    {
        string authUrl = authService.GoogleAuthorize();

        return Ok(new GoogleAuthResponseDto { AuthorizationUrl = authUrl });
    }
    
    [HttpGet("google/link")]
    public IActionResult GoogleLinkAuthorize()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        string authUrl = authService.GoogleLinkAuthorize(userId);

        return Ok(new { authorizationUrl = authUrl });
    }

    [HttpGet("google/callback")]
    public async Task<IActionResult> GoogleCallback(
        [FromQuery] GoogleCallbackDto googleCallbackDto,
        IValidator<GoogleCallbackDto> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(googleCallbackDto,cancellationToken);

        var (user, error) = await authService.GoogleCallback(
            googleCallbackDto.code,
            googleCallbackDto.state,
            googleCallbackDto.error,
            Response,cancellationToken);

        var frontendBaseUrl = configuration["FRONTEND_URL"]!;

        if (!string.IsNullOrEmpty(error))
        {
            string redirectPath = user != null ? "/app" : "/login";
            return Redirect($"{frontendBaseUrl}{redirectPath}?type=google_canceled&message={Uri.EscapeDataString(error)}");
        }

        if (user is null)
        {
            return Redirect($"{frontendBaseUrl}/auth?type=user_creation&message={Uri.EscapeDataString("Failed to create or link user account")}");
        }

        return Redirect($"{frontendBaseUrl}/app");
    }
    
    [HttpPost("logout")]
    public async Task<IActionResult> Logout(
        CancellationToken cancellationToken)
    {
        var refreshTokenValue = Request.Cookies["refreshToken"];

        await authService.Logout(refreshTokenValue,Response,cancellationToken);

        return NoContent();
    }
    [HttpGet("confirm-email")]
    [AllowAnonymous]
    public async Task<IActionResult> ConfirmEmail(
        [FromQuery] ConfirmationDto confirmationDto,
        IValidator<ConfirmationDto> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(confirmationDto,cancellationToken);

        bool success = await authService.ConfirmEmail(confirmationDto.UserId,
            confirmationDto.Token);
        
        var frontendUrl = configuration["FRONTEND_URL"];
        
        return success ? Redirect($"{frontendUrl}/email-confirmed?status=success") 
                       : Redirect($"{frontendUrl}/email-confirmed?status=failure");
    }
    
    [AllowAnonymous]
    [HttpPost("resend-confirmation-email")]
    public async Task<IActionResult> ResendConfirmationEmail( 
        ResendConfirmationEmailDto dto,
        IValidator<ResendConfirmationEmailDto> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(dto,cancellationToken);

        await authService.ResendConfirmationEmail(dto,HttpContext,Url);

        return NoContent();
    }
    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword(
        ForgotPasswordDto dto,
        IValidator<ForgotPasswordDto> validator,
        CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(dto,cancellationToken);

        await authService.ForgotPassword(dto,HttpContext,Url);
        
        return NoContent();
    }
    [HttpGet("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> GetResetPasswordPage(
    [FromQuery] EmailResetPasswordDto emailResetPasswordDto,
    IValidator<EmailResetPasswordDto> validator,
    CancellationToken cancellationToken)
    {
        var frontendUrl = configuration["FRONTEND_URL"];
        
        var validationResult = await validator.ValidateAsync(emailResetPasswordDto,cancellationToken);
        if (!validationResult.IsValid)
        {
            return Redirect($"{frontendUrl}/login?type=reset_password_error&" +
                            $"message={Uri.EscapeDataString("Unable to reset password. Please try again.")}");
        }

        ResetPasswordResultDto result = authService.GetResetPasswordPage(emailResetPasswordDto);
        
        
        return Redirect($"{frontendUrl}/reset-password?token={result.Token}&email={result.Email}");
    }
    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ProcessResetPassword(
    ResetPasswordDto processResetPasswordDto,
    IValidator<ResetPasswordDto> validator,
    CancellationToken cancellationToken)
    {
        await validator.ValidateAndThrowAsync(processResetPasswordDto,cancellationToken);

        await authService.ProcessResetPassword(processResetPasswordDto);
        
        return NoContent();
    }
}