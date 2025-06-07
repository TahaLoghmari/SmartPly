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

namespace backend.Controllers;

[ApiController]
[Route("auth")]
public sealed class AuthController(
    UserManager<User> userManager,
    IOptions<JwtAuthOptions> options,
    IConfiguration configuration,
    GoogleTokensProvider googleTokensProvider,
    CookieService cookieService,
    TokenManagementService tokenManagementService) : ControllerBase
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
            Email = registerUserDto.Email
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

        AccessTokensDto accessTokens = await tokenManagementService.CreateAndStoreTokens(user.Id, registerUserDto.Email);

        cookieService.AddCookies(Response, accessTokens, _jwtAuthOptions);
        
        return Ok(new { message = "Registration successful" });
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginUserDto loginUserDto,
        IValidator<LoginUserDto> validator)
    {
        await validator.ValidateAndThrowAsync(loginUserDto);

        User? user = await userManager.FindByEmailAsync(loginUserDto.Email);

        if (user is null || !await userManager.CheckPasswordAsync(user, loginUserDto.Password))
        {
            return Unauthorized();
        }

        AccessTokensDto accessTokens = await tokenManagementService.CreateAndStoreTokens(user.Id, loginUserDto.Email);

        cookieService.AddCookies(Response, accessTokens, _jwtAuthOptions);

        return Ok(new { message = "Login successful" });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var refreshTokenValue = Request.Cookies["refreshToken"];

        if (string.IsNullOrEmpty(refreshTokenValue))
        {
            return Unauthorized();
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

        return Content(@"
                        <html>
                          <body>
                            <script>
                              window.opener && window.opener.postMessage('google-auth-success', '*');
                              window.close();
                            </script>
                            <p>Authentication successful. You can close this window.</p>
                          </body>
                        </html>", "text/html");
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var user = await userManager.FindByIdAsync(userId);

        if (user is null) return NotFound();
        
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
}