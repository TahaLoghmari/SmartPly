using backend.DTOs;
using backend.Settings;
using Microsoft.Extensions.Options;

public sealed class CookieService(
    IOptions<JwtAuthSettings> jwtAuthSettings,
    IWebHostEnvironment environment)
{
    private readonly JwtAuthSettings _jwtAuthSettings = jwtAuthSettings.Value;

    private CookieOptions CreateCookieOptions(bool isHttps)
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = isHttps,
            Path = "/",
            SameSite = isHttps? SameSiteMode.None : SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddMinutes(_jwtAuthSettings.ExpirationInMinutes),
        };
    }

    private CookieOptions CreateRefreshCookieOptions(bool isHttps)
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = isHttps,
            Path = "/",
            SameSite = isHttps? SameSiteMode.None : SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(_jwtAuthSettings.RefreshTokenExpirationDays)
        };
    }

    public void AddCookies(
        HttpResponse response,
        AccessTokensDto accessTokens
    )
    {
        var isHttps = response.HttpContext.Request.IsHttps;
        RemoveCookies(response, isHttps);
        response.Cookies.Append("accessToken", accessTokens.AccessToken, CreateCookieOptions(isHttps));
        response.Cookies.Append("refreshToken", accessTokens.RefreshToken, CreateRefreshCookieOptions(isHttps));
    }

    public void RemoveCookies(HttpResponse response, bool isHttps)
    {
        var expiredOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = isHttps,
            Path = "/",
            SameSite = isHttps? SameSiteMode.None : SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(-1)
        };

        response.Cookies.Append("accessToken", "", expiredOptions);
        response.Cookies.Append("refreshToken", "", expiredOptions);
    }
}