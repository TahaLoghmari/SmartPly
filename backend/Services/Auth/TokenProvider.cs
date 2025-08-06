using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using backend.DTOs;
using backend.Entities;
using backend.Settings;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services;

public sealed class TokenProvider(
    IOptions<JwtAuthSettings> jwtAuthSettings)
{
    private readonly JwtAuthSettings _jwtAuthSettings = jwtAuthSettings.Value;
    public AccessTokensDto Create(TokenRequest tokenRequest)
    {
        return new AccessTokensDto(
            GenerateAccessToken(tokenRequest),
            GenerateRefreshToken()
        );
    }
    private string GenerateAccessToken(TokenRequest tokenRequest)
    {
        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_jwtAuthSettings.Key)
        );
        var credentials = new SigningCredentials(
            securityKey,
            SecurityAlgorithms.HmacSha256
        );

        List<Claim> claims = new()
        {
            new Claim(JwtRegisteredClaimNames.Sub,   tokenRequest.UserId),
            new Claim(JwtRegisteredClaimNames.Email, tokenRequest.Email)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(
                                    _jwtAuthSettings.ExpirationInMinutes),
            SigningCredentials = credentials,
            Issuer = _jwtAuthSettings.Issuer,
            Audience = _jwtAuthSettings.Audience
        };

        var handler = new JsonWebTokenHandler();
        string accessToken = handler.CreateToken(tokenDescriptor);
        return accessToken;
    }
    public string GenerateRefreshToken()
    {
        byte[] randomBytes = RandomNumberGenerator.GetBytes(32);

        return Convert.ToBase64String(randomBytes);
    }
}