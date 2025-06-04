using backend.DTOs;
using backend.Entities;
using backend.Mappings;
using backend.Services;
using backend.Settings;
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

        return Ok(new { AuthorizationUrl = authUrl });
    }

    [HttpGet("google/callback")]
    public async Task<IActionResult> GoogleCallback(
        string code,
        string? error,
        ProblemDetailsFactory problemDetailsFactory)
    {
        if (!string.IsNullOrEmpty(error))
        {
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status400BadRequest,
                title: "Google authorization error",
                detail: error
            );
            return BadRequest(problem);
        }

        if (string.IsNullOrEmpty(code))
        {
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status400BadRequest,
                title: "Authorization code is missing",
                detail: "No authorization code was provided by Google."
            );
            return BadRequest(problem);
        }

        var tokens = await googleTokensProvider.ExchangeCodeForTokens(code);
        var googleUser = await googleTokensProvider.GetGoogleUserInfo(tokens.IdToken);
        var user = await googleTokensProvider.FindOrCreateUser(googleUser);

        await googleTokensProvider.StoreGoogleTokens(user, tokens);

        AccessTokensDto accessTokens = await tokenManagementService.CreateAndStoreTokens(user.Id, user.Email!);

        cookieService.AddCookies(Response, accessTokens, _jwtAuthOptions);

        var frontendUrl = "http://localhost:5173";
        return Redirect(frontendUrl);
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