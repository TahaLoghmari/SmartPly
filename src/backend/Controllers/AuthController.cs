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

        AccessTokensDto accessTokens = await tokenManagementService.CreateAndStoreTokens(user.Id, registerUserDto.Email);

        return Ok(new {
            accessToken = accessTokens.AccessToken,
            refreshToken = accessTokens.RefreshToken
        });
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

        return Ok(new
        {
            accessToken = accessTokens.AccessToken,
            refreshToken = accessTokens.RefreshToken
        });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(RefreshTokenRequestDto dto, [FromServices] ProblemDetailsFactory problemDetailsFactory)
    {
        if (string.IsNullOrEmpty(dto.RefreshToken))
        {
            var problem = problemDetailsFactory.CreateProblemDetails(
                HttpContext,
                StatusCodes.Status401Unauthorized,
                title: "Unauthorized",
                detail: "Refresh token is missing."
            );
            return Unauthorized(problem);
        }

        AccessTokensDto accessTokens = await tokenManagementService.RefreshUserTokens(dto.RefreshToken);
        return Ok(new
        {
            accessToken = accessTokens.AccessToken,
            refreshToken = accessTokens.RefreshToken
        });
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

        return Redirect("http://localhost:5173/?accessToken=" + Uri.EscapeDataString(accessTokens.AccessToken) +
                        "&refreshToken=" + Uri.EscapeDataString(accessTokens.RefreshToken));
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
}