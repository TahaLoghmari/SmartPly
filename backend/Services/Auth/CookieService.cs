using backend.DTOs;
using backend.Settings;
using Microsoft.Extensions.Options;

namespace backend.Services;

public sealed class CookieService(
    IOptions<JwtAuthSettings> jwtAuthSettings,
    IOptions<CookieSettings> cookieSettings,
    IWebHostEnvironment environment)
{
    private readonly JwtAuthSettings _jwtAuthSettings = jwtAuthSettings.Value;
    private readonly CookieSettings _cookieSettings = cookieSettings.Value;
    private CookieOptions CreateCookieOptions()
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = environment.IsProduction(),
            SameSite = !environment.IsProduction() ? SameSiteMode.Lax : SameSiteMode.None, 
            Expires = DateTime.UtcNow.AddMinutes(_jwtAuthSettings.ExpirationInMinutes),
            Domain = _cookieSettings.Domain,
            Path = _cookieSettings.Path
        };
    }
    
    private CookieOptions CreateRefreshCookieOptions()
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = environment.IsProduction(), 
            SameSite = !environment.IsProduction() ? SameSiteMode.Lax : SameSiteMode.None, 
            Expires = DateTime.UtcNow.AddDays(_jwtAuthSettings.RefreshTokenExpirationDays),
            Domain = _cookieSettings.Domain,
            Path = _cookieSettings.Path
        };
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
            SameSite = !environment.IsProduction() ? SameSiteMode.Lax : SameSiteMode.None ,
            Expires = DateTime.UtcNow.AddDays(-1),
            Domain = _cookieSettings.Domain,
            Path = _cookieSettings.Path
        };

        response.Cookies.Append("accessToken", "", expiredOptions);
        response.Cookies.Append("refreshToken", "", expiredOptions);
    }
}