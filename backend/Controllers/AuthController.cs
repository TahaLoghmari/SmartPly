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
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[Route("auth")]
[EnableRateLimiting("fixed")]
public sealed class AuthController(
    UserManager<User> userManager,
    IOptions<JwtAuthOptions> options,
    IConfiguration configuration,
    TokenManagementService tokenManagementService,
    CookieService cookieService,
    EmailSenderService emailSenderService,
    ILogger<AuthController> logger,
    AuthService authService) : ControllerBase
{
    private readonly JwtAuthOptions _jwtAuthOptions = options.Value;

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterUserDto registerUserDto,
        IValidator<RegisterUserDto> validator)
    {
        await validator.ValidateAndThrowAsync(registerUserDto);
        
        await authService.Register(registerUserDto,HttpContext, Url);
        
        return NoContent();
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginUserDto loginUserDto,
        IValidator<LoginUserDto> validator)
    {
        await validator.ValidateAndThrowAsync(loginUserDto);
        
        await authService.Login(loginUserDto,_jwtAuthOptions,HttpContext);

        return NoContent();
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var refreshTokenValue = Request.Cookies["refreshToken"];

        await authService.Refresh(refreshTokenValue, _jwtAuthOptions, HttpContext);
        
        return NoContent();
    }
    
    [HttpGet("google/authorize")]
    public IActionResult GoogleAuthorize()
    {
        string authUrl = authService.GoogleAuthorize();

        return Ok(new { authorizationUrl = authUrl });
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
        IValidator<GoogleCallbackDto> validator)
    {
        await validator.ValidateAndThrowAsync(googleCallbackDto);

        var (user, error) = await authService.GoogleCallback(
            googleCallbackDto.code,
            googleCallbackDto.state,
            googleCallbackDto.error,
            _jwtAuthOptions,
            Response);

        var frontendBaseUrl = configuration["Frontend:BaseUrl"]!;

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

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        UserDto userDto = await authService.GetCurrentUser(userId);

        return Ok(userDto);
    }
    
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var refreshTokenValue = Request.Cookies["refreshToken"];

        await authService.Logout(refreshTokenValue,Response);

        return NoContent();
    }
    [HttpGet("confirm-email")]
    [AllowAnonymous]
    public async Task<IActionResult> ConfirmEmail(
        [FromQuery] ConfirmationDto confirmationDto,
        IValidator<ConfirmationDto> validator)
    {
        await validator.ValidateAndThrowAsync(confirmationDto);

        await authService.ConfirmEmail(confirmationDto.UserId,
            confirmationDto.Token);
        
        var frontendUrl = configuration["Frontend:BaseUrl"];
        
        return Redirect($"{frontendUrl}/email-confirmed");
    }
    
    [AllowAnonymous]
    [HttpPost("resend-confirmation-email")]
    public async Task<IActionResult> ResendConfirmationEmail( 
        ResendConfirmationEmailDto dto,
        IValidator<ResendConfirmationEmailDto> validator)
    {
        await validator.ValidateAndThrowAsync(dto);

        await authService.ResendConfirmationEmail(dto,HttpContext,Url);

        return NoContent();
    }
    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword(
        ForgotPasswordDto dto,
        IValidator<ForgotPasswordDto> validator)
    {
        await validator.ValidateAndThrowAsync(dto);

        await authService.ForgotPassword(dto,HttpContext,Url);
        
        return NoContent();
    }
    [HttpGet("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> GetResetPasswordPage(
    [FromQuery] EmailResetPasswordDto emailResetPasswordDto,
    IValidator<EmailResetPasswordDto> validator)
    {
        await validator.ValidateAndThrowAsync(emailResetPasswordDto);

        ResetPasswordResultDto result = authService.GetResetPasswordPage(emailResetPasswordDto);
        
        var frontendUrl = configuration["Frontend:BaseUrl"];
        
        return Redirect($"{frontendUrl}/reset-password?token={result.Token}&email={result.Email}");
    }
    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ProcessResetPassword(
    ResetPasswordDto processResetPasswordDto,
    IValidator<ResetPasswordDto> validator)
    {
        await validator.ValidateAndThrowAsync(processResetPasswordDto);

        await authService.ProcessResetPassword(processResetPasswordDto);
        
        return NoContent();
    }
}