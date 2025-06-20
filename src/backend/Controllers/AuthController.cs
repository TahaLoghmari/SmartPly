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
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;

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
    EmailSenderService emailSenderService) : ControllerBase
{
    private readonly JwtAuthOptions _jwtAuthOptions = options.Value;

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterUserDto registerUserDto,
        IValidator<RegisterUserDto> validator,
        ProblemDetailsFactory problemDetailsFactory)
    {
        await validator.ValidateAndThrowAsync(registerUserDto);
        
        var existingUser = await userManager.FindByEmailAsync(registerUserDto.Email);
        if (existingUser != null)
        {
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
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status400BadRequest,
                title: "Registration failed",
                detail: "User registration failed due to invalid input or duplicate email."
            );
            problem.Extensions.Add("errors", result.Errors.Select(e => new { e.Code, e.Description }));
            return BadRequest(problem);
        }

        await SendConfirmationEmail(registerUserDto.Email, user);
        
        return Ok(new { message = "Registration successful" });
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginUserDto loginUserDto,
        IValidator<LoginUserDto> validator,
        ProblemDetailsFactory problemDetailsFactory)
    {
        await validator.ValidateAndThrowAsync(loginUserDto);

        User? user = await userManager.FindByEmailAsync(loginUserDto.Email);
        
        if ( user is null )
        {
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

        return Ok(new { message = "Login successful" });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh( [FromServices] ProblemDetailsFactory problemDetailsFactory)
    {
        var refreshTokenValue = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshTokenValue))
        {
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
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status401Unauthorized,
                title: "Unauthorized",
                detail: "Refresh token not found or expired."
            );
            return Problem(problem.Detail, statusCode: problem.Status, title: problem.Title);
        }
        
        cookieService.AddCookies(Response, tokens, _jwtAuthOptions);
        
        return Ok(new { message = "Token refreshed successfully" });
    }
    
    [HttpGet("google/authorize")]
    public IActionResult GoogleAuthorize()
    {
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

        return Ok(new { authorizationUrl = authUrl });
    }

    [HttpGet("google/callback")]
    public async Task<IActionResult> GoogleCallback(
        [FromQuery] GoogleCallbackDto googleCallbackDto,
        ProblemDetailsFactory problemDetailsFactory)
    {
        if (!string.IsNullOrEmpty(googleCallbackDto.error))
        {
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status400BadRequest,
                title: "Google authorization error",
                detail: googleCallbackDto.error
            );
            return BadRequest(problem);
        }

        if (string.IsNullOrEmpty(googleCallbackDto.code))
        {
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status400BadRequest,
                title: "Authorization code is missing",
                detail: "No authorization code was provided by Google."
            );
            return BadRequest(problem);
        }

        GoogleTokenResponse? tokens = await googleTokensProvider.ExchangeCodeForTokens(googleCallbackDto.code);
        
        if (tokens is null)
        {
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status400BadRequest,
                title: "Failed to exchange authorization code",
                detail: "Could not retrieve tokens from Google."
            );
            return BadRequest(problem);
        }

        var googleUser = await googleTokensProvider.GetGoogleUserInfo(tokens.IdToken);

        User? user = await googleTokensProvider.FindOrCreateUser(googleUser);
        
        if ( user is null )
        {
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status400BadRequest,
                title: "User creation failed",
                detail: "Could not create , find user with Google information or link user to google account."
            );
            return BadRequest(problem);
        }

        await googleTokensProvider.StoreGoogleTokens(user, tokens);

        AccessTokensDto accessTokens = await tokenManagementService.CreateAndStoreTokens(user.Id, user.Email!);
        
        cookieService.AddCookies(Response, accessTokens, _jwtAuthOptions);

        return Redirect(configuration["Frontend:BaseUrl"]!);
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser(
        ProblemDetailsFactory problemDetailsFactory)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
        {
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
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status404NotFound,
                title: "User not found",
                detail: $"No user found with ID '{userId}'."
            );
            return NotFound(problem);
        }
        
        var userDto = user.toUserDto();

        return Ok(userDto);
    }
    
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var refreshTokenValue = Request.Cookies["refreshToken"];

        if (!string.IsNullOrEmpty(refreshTokenValue))
        {
            await tokenManagementService.RemoveRefreshToken(refreshTokenValue);
        }

        cookieService.RemoveCookies(Response);

        return Ok(new { message = "Logged out successfully" });
    }
    [HttpGet("confirm-email")]
    [AllowAnonymous]
    public async Task<IActionResult> ConfirmEmail(
        [FromQuery] ConfirmationDto confirmationDto,
        ProblemDetailsFactory problemDetailsFactory,
        IValidator<ConfirmationDto> validator)
    {
        await validator.ValidateAndThrowAsync(confirmationDto);

        var user = await userManager.FindByIdAsync(confirmationDto.UserId);
        if (user is null)
        {
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
            return Redirect($"{frontendUrl}/email-confirmed?status=success");
        }
        return Redirect($"{frontendUrl}/email-confirmed?status=error");
    }
    
    [AllowAnonymous]
    [HttpPost("resend-confirmation-email")]
    public async Task<IActionResult> ResendConfirmationEmail( 
        ResendConfirmationEmailDto dto,
        ProblemDetailsFactory problemDetailsFactory,
        IValidator<ResendConfirmationEmailDto> validator)
    {
        await validator.ValidateAndThrowAsync(dto);
        
        var user = await userManager.FindByEmailAsync(dto.Email);

        if (user is null || await userManager.IsEmailConfirmedAsync(user))
        {
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status400BadRequest,
                title: "User not found",
                detail: "No user exists with the provided email or the email is already confirmed."
            );
            return BadRequest(problem);
        }

        await SendConfirmationEmail(dto.Email, user);

        return Ok(new { message = "Confirmation email sent. Please check your inbox." });
    }
    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword(
        ForgotPasswordDto dto,
        ProblemDetailsFactory problemDetailsFactory,
        IValidator<ForgotPasswordDto> validator)
    {
        await validator.ValidateAndThrowAsync(dto);

        var user = await userManager.FindByEmailAsync(dto.Email);

        if ( user != null )
        {
            await SendForgotPasswordEmail(user.Email, user);
        }
        
        return Ok(new { message = "Reset Password email sent. Please check your inbox." });
    }
    [HttpGet("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword(
    [FromQuery] EmailResetPasswordDto emailResetPasswordDto,
    IValidator<EmailResetPasswordDto> validator)
    {
        var frontendUrl = configuration["Frontend:BaseUrl"];

        var validationResult = await validator.ValidateAsync(emailResetPasswordDto);
        if (!validationResult.IsValid)
        {
            return Redirect($"{frontendUrl}/reset-password?status=invalid");
        }

        var encodedToken = Uri.EscapeDataString(emailResetPasswordDto.Token);
        var encodedEmail = Uri.EscapeDataString(emailResetPasswordDto.Email);

        return Redirect($"{frontendUrl}/reset-password?token={encodedToken}&email={encodedEmail}");
    }
    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<IActionResult> ResetPassword(
    ResetPasswordDto processResetPasswordDto,
    ProblemDetailsFactory problemDetailsFactory,
    IValidator<ResetPasswordDto> validator)
    {
        await validator.ValidateAndThrowAsync(processResetPasswordDto);

        var user = await userManager.FindByEmailAsync(processResetPasswordDto.Email);
        if (user is null)
        {
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
            return Redirect($"{frontendUrl}/reset-password?status=success");
        }

        var resetFailedProblem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status400BadRequest,
                title: "Password Reset Failed",
                detail: "The password reset token is invalid or has expired."
            );
        return BadRequest(resetFailedProblem);
    }
    private async Task SendForgotPasswordEmail(string? email, User? user)
    {
        var token = await userManager.GeneratePasswordResetTokenAsync(user);

        var passwordResetLink = Url.Action("ResetPassword", "Auth",
            new { Email = email, Token = token }, protocol: HttpContext.Request.Scheme);

        var safeLink = HtmlEncoder.Default.Encode(passwordResetLink);

        var subject = "Reset Your Password";

        var messageBody = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""utf-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Reset Your SmartPly Password</title>
</head>
<body style=""margin: 0; padding: 0; background-color: #f8f9fa;"">
    <div style=""max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"">
        
        <!-- Header -->
        <div style=""background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;"">
            <h1 style=""color: #ffffff; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 28px; font-weight: 300;"">
                Password Reset Request
            </h1>
            <p style=""color: #e8ecff; margin: 10px 0 0 0; font-size: 16px;"">
                Let's get you back in
            </p>
        </div>

        <!-- Content -->
        <div style=""padding: 40px 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.7; color: #2c3e50;"">
            
            <p style=""font-size: 18px; margin: 0 0 25px 0;"">
                Hi <strong style=""color: #667eea;"">{user.Name}</strong>,
            </p>

            <p style=""font-size: 16px; margin: 0 0 30px 0;"">
                We received a request to reset your password for your <strong>SmartPly</strong> account. 
                If you made this request, please click the button below to reset your password:
            </p>

            <!-- CTA Button -->
            <div style=""text-align: center; margin: 40px 0;"">
                <a href=""{safeLink}"" 
                   style=""background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                          color: #ffffff;
                          padding: 16px 32px;
                          text-decoration: none;
                          font-weight: 600;
                          font-size: 16px;
                          border-radius: 8px;
                          display: inline-block;
                          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                          transition: all 0.3s ease;"">
                    🔑 Reset Password
                </a>
            </div>

            <!-- Alternative Link -->
            <div style=""background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 30px 0;"">
                <p style=""margin: 0 0 10px 0; font-size: 14px; color: #6c757d;"">
                    <strong>Button not working?</strong> Copy and paste this link into your browser:
                </p>
                <p style=""margin: 0; word-break: break-all;"">
                    <a href=""{safeLink}"" style=""color: #667eea; text-decoration: none; font-size: 14px;"">
                        {safeLink}
                    </a>
                </p>
            </div>

            <!-- Security Note -->
            <div style=""margin: 30px 0; padding: 15px; background-color: #fff3cd; border-radius: 6px; border: 1px solid #ffeaa7;"">
                <p style=""margin: 0; font-size: 14px; color: #856404;"">
                    🔒 <strong>Security Note:</strong> If you didn't request a password reset, you can safely ignore this email or contact support if you have concerns.
                </p>
            </div>

        </div>

        <!-- Footer -->
        <div style=""background-color: #2c3e50; padding: 30px; text-align: center;"">
            <p style=""color: #ffffff; margin: 0 0 10px 0; font-size: 16px; font-weight: 500;"">
                Best regards,
            </p>
            <p style=""color: #bdc3c7; margin: 0; font-size: 14px;"">
                The SmartPly Team
            </p>
            
            <div style=""margin-top: 20px; padding-top: 20px; border-top: 1px solid #34495e;"">
                <p style=""color: #95a5a6; margin: 0; font-size: 12px;"">
                    This email was sent to you because you requested a password reset for SmartPly.<br>
                    © 2025 SmartPly. All rights reserved.
                </p>
            </div>
        </div>

    </div>
</body>
</html>
";

        SendEmailDto sendEmailDto = new SendEmailDto(email, subject, messageBody, true);
        await emailSenderService.SendEmailAsync(sendEmailDto);
    }
    private async Task SendConfirmationEmail(string email, User user)
    {
        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);

        var confirmationLink = Url.Action("ConfirmEmail", "Auth",
            new { UserId = user.Id, Token = token }, protocol: HttpContext.Request.Scheme);

        if (confirmationLink is null)
        {
            var problem = new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "Email confirmation link generation failed",
                Detail = "Could not generate a valid email confirmation link."
            };
            throw new Exception(problem.Detail);
        }

        var safeLink = HtmlEncoder.Default.Encode(confirmationLink);

        var subject = "Welcome to SmartPly! Please Confirm Your Email";

        var messageBody = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""utf-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Welcome to SmartPly</title>
</head>
<body style=""margin: 0; padding: 0; background-color: #f8f9fa;"">
    <div style=""max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"">
        
        <!-- Header -->
        <div style=""background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;"">
            <h1 style=""color: #ffffff; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 28px; font-weight: 300;"">
                Welcome to <strong>SmartPly</strong>
            </h1>
            <p style=""color: #e8ecff; margin: 10px 0 0 0; font-size: 16px;"">
                Let's get you started
            </p>
        </div>

        <!-- Content -->
        <div style=""padding: 40px 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.7; color: #2c3e50;"">
            
            <p style=""font-size: 18px; margin: 0 0 25px 0;"">
                Hi <strong style=""color: #667eea;"">{user.Name}</strong>,
            </p>

            <p style=""font-size: 16px; margin: 0 0 30px 0;"">
                Thank you for creating an account with us! We're excited to have you join the SmartPly community. 
                To unlock all of our amazing features, please confirm your email address.
            </p>

            <!-- CTA Button -->
            <div style=""text-align: center; margin: 40px 0;"">
                <a href=""{safeLink}"" 
                   style=""background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                          color: #ffffff;
                          padding: 16px 32px;
                          text-decoration: none;
                          font-weight: 600;
                          font-size: 16px;
                          border-radius: 8px;
                          display: inline-block;
                          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                          transition: all 0.3s ease;"">
                    ✓ Confirm Your Email
                </a>
            </div>

            <!-- Alternative Link -->
            <div style=""background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 30px 0;"">
                <p style=""margin: 0 0 10px 0; font-size: 14px; color: #6c757d;"">
                    <strong>Button not working?</strong> Copy and paste this link into your browser:
                </p>
                <p style=""margin: 0; word-break: break-all;"">
                    <a href=""{safeLink}"" style=""color: #667eea; text-decoration: none; font-size: 14px;"">
                        {safeLink}
                    </a>
                </p>
            </div>

            <!-- Security Note -->
            <div style=""margin: 30px 0; padding: 15px; background-color: #fff3cd; border-radius: 6px; border: 1px solid #ffeaa7;"">
                <p style=""margin: 0; font-size: 14px; color: #856404;"">
                    🔒 <strong>Security Note:</strong> If you didn't create this account, you can safely ignore this email.
                </p>
            </div>

        </div>

        <!-- Footer -->
        <div style=""background-color: #2c3e50; padding: 30px; text-align: center;"">
            <p style=""color: #ffffff; margin: 0 0 10px 0; font-size: 16px; font-weight: 500;"">
                Best regards,
            </p>
            <p style=""color: #bdc3c7; margin: 0; font-size: 14px;"">
                The SmartPly Team
            </p>
            
            <div style=""margin-top: 20px; padding-top: 20px; border-top: 1px solid #34495e;"">
                <p style=""color: #95a5a6; margin: 0; font-size: 12px;"">
                    This email was sent to you because you signed up for SmartPly.<br>
                    © 2025 SmartPly. All rights reserved.
                </p>
            </div>
        </div>

    </div>
</body>
</html>
";
        SendEmailDto sendEmailDto = new SendEmailDto(email, subject, messageBody, true);

        await emailSenderService.SendEmailAsync(sendEmailDto);
    }
}