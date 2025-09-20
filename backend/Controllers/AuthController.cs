using backend.DTOs;
using backend.Services;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;
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

        var frontendBaseUrl = configuration["Frontend:BaseUrl"]!;
        var frontendAppUrl = $"{frontendBaseUrl}/app";

        if (!string.IsNullOrEmpty(error))
        {
            string redirectPath = user != null ? "/app" : "/login";
            return Redirect($"{frontendBaseUrl}{redirectPath}?type=google_canceled&message={Uri.EscapeDataString(error)}");
        }

        if (user is null)
        {
            return Redirect($"{frontendBaseUrl}/auth?type=user_creation&message={Uri.EscapeDataString("Failed to create or link user account")}");
        }
        
        var serializedFrontendOrigin = JsonSerializer.Serialize(new Uri(frontendBaseUrl).GetLeftPart(UriPartial.Authority));
        var serializedAppUrl = JsonSerializer.Serialize(frontendAppUrl);

        var html = $@"
    <!doctype html>
    <html>
      <head>
        <meta charset='utf-8'/>
        <title>Signing you in…</title>
        <meta name='viewport' content='width=device-width,initial-scale=1' />
      </head>
      <body>
        <script>
          (function() {{
            const openerOrigin = {serializedFrontendOrigin}; // e.g. ""https://smart-ply.vercel.app""
            const appUrl = {serializedAppUrl};

            try {{
              // If this callback was opened as a popup from the SPA, notify the opener and close.
              if (window.opener && window.opener !== window && window.opener.origin === openerOrigin) {{
                window.opener.postMessage({{ type: 'oauth_success' }}, openerOrigin);
                // give the browser a moment to persist cookies, then close
                setTimeout(() => window.close(), 150);
                return;
              }}
            }} catch (e) {{
              // Some browsers restrict access to opener properties; fall through to top-level navigation
            }}

            // Default: top-level navigation to the SPA. Use replace to avoid leaving this page in history.
            window.location.replace(appUrl);
          }})();
        </script>

        <noscript>
          <meta http-equiv='refresh' content='0;url=' + {serializedAppUrl} />
          <p>Redirecting… <a href={serializedAppUrl}>Continue</a></p>
        </noscript>
      </body>
    </html>";

        // Return the HTML 200 so the browser processes Set-Cookie headers and persists cookies reliably
        return Content(html, "text/html");
        // return Redirect($"{frontendBaseUrl}/app");
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
        
        var frontendUrl = configuration["Frontend:BaseUrl"];
        
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
        var frontendUrl = configuration["Frontend:BaseUrl"];
        
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