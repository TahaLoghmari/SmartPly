using backend.DTOs;
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
using System.Text.Encodings.Web;
using backend.DTOs.Email;

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

        
        AccessTokensDto accessTokens = await tokenManagementService.CreateAndStoreTokens(user.Id, registerUserDto.Email);

        cookieService.AddCookies(Response, accessTokens, _jwtAuthOptions);
        
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

        var result = await userManager.CheckPasswordAsync(user, loginUserDto.Password);

        if ( user is null || !result )
        {
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status400BadRequest,
                title: "Login failed",
                detail: "Invalid email or password."
            );
            return BadRequest(problem);
        }
        
        AccessTokensDto accessTokens = await tokenManagementService.CreateAndStoreTokens(user.Id, loginUserDto.Email);

        cookieService.AddCookies(Response, accessTokens, _jwtAuthOptions);

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

        AccessTokensDto accessTokens = await tokenManagementService.RefreshUserTokens(refreshTokenValue);
        
        cookieService.AddCookies(Response, accessTokens, _jwtAuthOptions);
        
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

        var tokens = await googleTokensProvider.ExchangeCodeForTokens(googleCallbackDto.code);
        // now I Have the access Token and refresh Token for Google's APIs
        var googleUser = await googleTokensProvider.GetGoogleUserInfo(tokens.IdToken);
        // the idToken is validated
        var user = await googleTokensProvider.FindOrCreateUser(googleUser);

        await googleTokensProvider.StoreGoogleTokens(user, tokens);

        AccessTokensDto accessTokens = await tokenManagementService.CreateAndStoreTokens(user.Id, user.Email!);
        
        cookieService.AddCookies(Response, accessTokens, _jwtAuthOptions);

        return Redirect("http://localhost:5173");
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
    
    private async Task SendConfirmationEmail(string email, User user)
    {
        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);

        var confirmationLink = Url.Action("ConfirmEmail", "Auth",
            new { UserId = user.Id, Token = token }, protocol: HttpContext.Request.Scheme);

        var safeLink = HtmlEncoder.Default.Encode(confirmationLink);
        
        var subject = "Welcome to Dot Net Tutorials! Please Confirm Your Email";

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
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> ConfirmEmail(string UserId, string Token)
    {
        if (string.IsNullOrEmpty(UserId) || string.IsNullOrEmpty(Token))
        {
            return BadRequest(new { error = "The link is invalid or has expired. Please request a new one if needed." });
        }

        var user = await userManager.FindByIdAsync(UserId);
        if (user == null)
        {
            return NotFound(new { error = "We could not find a user associated with the given link." });
        }

        var result = await userManager.ConfirmEmailAsync(user, Token);
        if (result.Succeeded)
        {
            return Ok(new { message = "Thank you for confirming your email address. Your account is now verified!" });
        }

        return BadRequest(new { error = "We were unable to confirm your email address. Please try again or request a new link." });
    }
    
    [HttpGet]
    public IActionResult ResendConfirmationEmail(bool IsResend = true)
    {
        var message = IsResend ? "Resend Confirmation Email" : "Send Confirmation Email";
        return Ok(new { message });
    }
    
    [HttpPost]
    public async Task<IActionResult> ResendConfirmationEmail(string Email)
    {
        var user = await userManager.FindByEmailAsync(Email);
        if (user == null || await userManager.IsEmailConfirmedAsync(user))
        {
            return Ok(new { message = "If an account exists for this email, a confirmation email has been sent." });
        }

        await SendConfirmationEmail(Email, user);

        return Ok(new { message = "Confirmation email sent. Please check your inbox." });
    }
}