using backend.DTOs;
using backend.Entities;
using backend.Exceptions;
using backend.Settings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace backend.Services;

public sealed class TokenManagementService(
    ApplicationDbContext applicationDbContext,
    IOptions<JwtAuthOptions> options,
    TokenProvider tokenProvider,
    ILogger<TokenManagementService> logger
)
{
    private readonly JwtAuthOptions _jwtAuthOptions = options.Value;

    public async Task<AccessTokensDto> CreateAndStoreTokens(
        string userId,
        string email,
        CancellationToken cancellationToken)
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

        await applicationDbContext.SaveChangesAsync(cancellationToken);

        return accessTokens;
    }

    public async Task<AccessTokensDto> RefreshUserTokens(
        string refreshTokenValue,
        CancellationToken cancellationToken)
    {
        var refreshToken = await applicationDbContext.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == refreshTokenValue,cancellationToken);

        if (refreshToken is null || refreshToken.ExpiresAtUtc < DateTime.UtcNow )
        {
            logger.LogWarning("Token refresh failed - invalid or expired refresh token");
            if (refreshToken is not null)
            {
                applicationDbContext.RefreshTokens.Remove(refreshToken);
                await applicationDbContext.SaveChangesAsync(cancellationToken);
            }
            throw new UnauthorizedException("Refresh token not found or expired.", "Unauthorized");
        }

        var tokenRequest = new TokenRequest(refreshToken.User.Id, refreshToken.User.Email!);
        AccessTokensDto tokens = tokenProvider.Create(tokenRequest);

        refreshToken.Token = tokens.RefreshToken;
        refreshToken.ExpiresAtUtc = DateTime.UtcNow.AddDays(_jwtAuthOptions.RefreshTokenExpirationDays);

        await applicationDbContext.SaveChangesAsync(cancellationToken);

        return tokens;
    }

    public async Task RemoveRefreshToken(
        string refreshTokenValue,
        CancellationToken cancellationToken)
    {
        var refreshToken = await applicationDbContext.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == refreshTokenValue,cancellationToken);

        if (refreshToken is null)
        {
            logger.LogInformation("Attempted to remove a refresh token that was not found or already removed.");
            return;
        }

        applicationDbContext.RefreshTokens.Remove(refreshToken);
        await applicationDbContext.SaveChangesAsync(cancellationToken);
    }
    
}