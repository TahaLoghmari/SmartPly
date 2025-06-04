using backend.DTOs;
using backend.Entities;
using backend.Services;
using backend.Settings;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace backend.Controllers;

[ApiController]
[Route("auth")]
[AllowAnonymous]
public sealed class AuthController(
    UserManager<User> userManager,
    TokenProvider tokenProvider,
    ApplicationDbContext applicationDbContext,
    IOptions<JwtAuthOptions> options,
    IConfiguration configuration,
    GoogleTokensProvider googleTokensProvider,
    CookieService cookieService ) : ControllerBase
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

        AccessTokensDto accessTokens = await tokenProvider.CreateAndStoreTokens(user.Id, registerUserDto.Email);

        cookieService.StoreCookies(_jwtAuthOptions, Response, accessTokens);
        
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

        AccessTokensDto accessTokens = await tokenProvider.CreateAndStoreTokens(user.Id, loginUserDto.Email);

        cookieService.StoreCookies(_jwtAuthOptions, Response, accessTokens);

        return Ok(new { message = "Login successful" });
    }
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {

        var refreshTokenValue = Request.Cookies["refreshToken"];

        RefreshToken? refreshToken = await applicationDbContext.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == refreshTokenValue );

        if (refreshToken is null)
        {
            return Unauthorized();
        }

        if (refreshToken.ExpiresAtUtc < DateTime.UtcNow)
        {
            return Unauthorized();
        }

        var tokenRequest = new TokenRequest(refreshToken.User.Id, refreshToken.User.Email!);
        AccessTokensDto accessTokens = tokenProvider.Create(tokenRequest);

        cookieService.StoreCookies(_jwtAuthOptions, Response, accessTokens);

        refreshToken.Token = accessTokens.RefreshToken;
        refreshToken.ExpiresAtUtc = DateTime.UtcNow.AddDays(_jwtAuthOptions.RefreshTokenExpirationDays);

        await applicationDbContext.SaveChangesAsync();

        return Ok(new { message = "Token refreshed successfully" });
    }

    [HttpGet("google/authorize")]
    public IActionResult GoogleAuthorize()
    {
        var clientId = configuration["Google:ClientId"];
        var redirectUri = configuration["Google:RedirectUri"]!;
        var scope = configuration["Google:Scopes"] !;
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
         string state,
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

        AccessTokensDto accessTokens = await tokenProvider.CreateAndStoreTokens(user.Id, user.Email!);

        cookieService.StoreCookies(_jwtAuthOptions, Response, accessTokens);

        var frontendUrl = $"http://localhost:5173";
    
        return Redirect(frontendUrl);
    }
}
