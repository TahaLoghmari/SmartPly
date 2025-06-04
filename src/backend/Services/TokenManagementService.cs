using backend.DTOs;
using backend.Entities;
using backend.Settings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace backend.Services;

public sealed class TokenManagementService(
    ApplicationDbContext applicationDbContext,
    IOptions<JwtAuthOptions> options,
    TokenProvider tokenProvider
)
{
    private readonly JwtAuthOptions _jwtAuthOptions = options.Value; // ✅ Make private

    public async Task<AccessTokensDto> CreateAndStoreTokens(string userId, string email)
    {

        var oldRefreshTokens = applicationDbContext.RefreshTokens
            .Where(rt => rt.UserId == userId);
        applicationDbContext.RefreshTokens.RemoveRange(oldRefreshTokens);

        TokenRequest tokenRequest = new TokenRequest(userId, email);
        AccessTokensDto accessTokens = tokenProvider.Create(tokenRequest);

        var refreshToken = new RefreshToken
        {
            Id = Guid.CreateVersion7(),
            UserId = userId,
            Token = accessTokens.RefreshToken,
            ExpiresAtUtc = DateTime.UtcNow.AddDays(_jwtAuthOptions.RefreshTokenExpirationDays)
        };

        applicationDbContext.RefreshTokens.Add(refreshToken);

        await applicationDbContext.SaveChangesAsync();

        return accessTokens;
    }

    public async Task<AccessTokensDto> RefreshUserTokens(string refreshTokenValue)
    {
        var refreshToken = await applicationDbContext.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == refreshTokenValue);

        if (refreshToken is null)
        {
            throw new UnauthorizedAccessException("Refresh token not found");
        }

        if (refreshToken.ExpiresAtUtc < DateTime.UtcNow)
        {
            throw new UnauthorizedAccessException("Refresh token expired");
        }

        var tokenRequest = new TokenRequest(refreshToken.User.Id, refreshToken.User.Email!);
        AccessTokensDto accessTokens = tokenProvider.Create(tokenRequest);

        refreshToken.Token = accessTokens.RefreshToken;
        refreshToken.ExpiresAtUtc = DateTime.UtcNow.AddDays(_jwtAuthOptions.RefreshTokenExpirationDays);

        await applicationDbContext.SaveChangesAsync();

        return accessTokens;
    }

    public async Task RemoveRefreshToken(string refreshTokenValue)
    {
        var refreshToken = await applicationDbContext.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == refreshTokenValue);

        if (refreshToken != null)
        {
            applicationDbContext.RefreshTokens.Remove(refreshToken);
            await applicationDbContext.SaveChangesAsync();
        }
    }

    public async Task RemoveAllUserRefreshTokens(string userId)
    {
        var userTokens = applicationDbContext.RefreshTokens
            .Where(rt => rt.UserId == userId);
        
        applicationDbContext.RefreshTokens.RemoveRange(userTokens);
        await applicationDbContext.SaveChangesAsync();
    }
}