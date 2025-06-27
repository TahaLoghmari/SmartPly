using backend.DTOs;
using backend.Settings;

namespace backend.Services;

public sealed class CookieService
{
    private CookieOptions CreateCookieOptions(JwtAuthOptions jwtAuthOptions)
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = false, 
            SameSite = SameSiteMode.Lax, 
            Expires = DateTime.UtcNow.AddMinutes(jwtAuthOptions.ExpirationInMinutes)
        };
    }
    
    private CookieOptions CreateRefreshCookieOptions(JwtAuthOptions jwtAuthOptions)
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = false, 
            SameSite = SameSiteMode.Lax, 
            Expires = DateTime.UtcNow.AddDays(jwtAuthOptions.RefreshTokenExpirationDays)
        };
    }
    
    public void AddCookies(
        HttpResponse Response,
        AccessTokensDto accessTokens,
        JwtAuthOptions jwtAuthOptions
    ) 
    {
        RemoveCookies(Response);
        Response.Cookies.Append("accessToken", accessTokens.AccessToken, CreateCookieOptions(jwtAuthOptions));
        Response.Cookies.Append("refreshToken", accessTokens.RefreshToken, CreateRefreshCookieOptions(jwtAuthOptions));
    }
    
    public void RemoveCookies(HttpResponse Response )
    {
        var expiredOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Lax ,
            Expires = DateTime.UtcNow.AddDays(-1)
        };

        Response.Cookies.Append("accessToken", "", expiredOptions);
        Response.Cookies.Append("refreshToken", "", expiredOptions);
    }
}