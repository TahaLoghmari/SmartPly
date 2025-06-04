using backend.DTOs;
using backend.Settings;

namespace backend.Services;

public sealed class CookieService
{
    public void StoreCookies(
        JwtAuthOptions jwtAuthOptions,
        HttpResponse Response,
        AccessTokensDto accessTokens)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddMinutes(jwtAuthOptions.ExpirationInMinutes)
        };

        var refreshCookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(jwtAuthOptions.RefreshTokenExpirationDays)
        };

        Response.Cookies.Append("accessToken", accessTokens.AccessToken, cookieOptions);
        Response.Cookies.Append("refreshToken", accessTokens.RefreshToken, refreshCookieOptions);
    }
}