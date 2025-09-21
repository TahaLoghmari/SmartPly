using backend.DTOs;
using backend.Settings;
using Microsoft.Extensions.Options;

namespace backend.Services;

public sealed class CookieService(
    IOptions<JwtAuthSettings> jwtAuthSettings,
    IWebHostEnvironment environment,
    IConfiguration configuration)
{
    private readonly JwtAuthSettings _jwtAuthSettings = jwtAuthSettings.Value;
    private readonly string? _cookieDomain = configuration["DOMAIN"];

    private CookieOptions CreateCookieOptions()
    {
        var options = new CookieOptions
        {
            HttpOnly = true,
            Secure = environment.IsProduction(),
            Path = "/",
            SameSite = SameSiteMode.Lax, 
            Expires = DateTime.UtcNow.AddMinutes(_jwtAuthSettings.ExpirationInMinutes),
        };
        if (environment.IsProduction() && !string.IsNullOrWhiteSpace(_cookieDomain))
        {
            options.Domain = _cookieDomain;
        }
        return options;
    }
    
    private CookieOptions CreateRefreshCookieOptions()
    {
        var options = new CookieOptions
        {
            HttpOnly = true,
            Secure = environment.IsProduction(), 
            Path = "/",
            SameSite = SameSiteMode.Lax, 
            Expires = DateTime.UtcNow.AddDays(_jwtAuthSettings.RefreshTokenExpirationDays)
        };
        if (environment.IsProduction() && !string.IsNullOrWhiteSpace(_cookieDomain))
        {
            options.Domain = _cookieDomain;
        }
        return options;
    }
    
    public void AddCookies(
        HttpResponse response,
        AccessTokensDto accessTokens
    ) 
    {
        RemoveCookies(response);
        response.Cookies.Append("accessToken", accessTokens.AccessToken, CreateCookieOptions());
        response.Cookies.Append("refreshToken", accessTokens.RefreshToken, CreateRefreshCookieOptions());
    }
    
    public void RemoveCookies(HttpResponse response)
    {
        var expiredOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = environment.IsProduction(),
            Path = "/",
            SameSite = SameSiteMode.Lax ,
            Expires = DateTime.UtcNow.AddDays(-1)
        };

        if (environment.IsProduction() && !string.IsNullOrWhiteSpace(_cookieDomain))
        {
            expiredOptions.Domain = _cookieDomain;
        }

        response.Cookies.Append("accessToken", "", expiredOptions);
        response.Cookies.Append("refreshToken", "", expiredOptions);
    }
}