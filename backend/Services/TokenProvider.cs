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

public sealed class TokenProvider(IOptions<JwtAuthOptions> options)
{
    private readonly JwtAuthOptions _jwtAuthOptions = options.Value;
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
            Encoding.UTF8.GetBytes(_jwtAuthOptions.Key)
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
                                    _jwtAuthOptions.ExpirationInMinutes),
            SigningCredentials = credentials,
            Issuer = _jwtAuthOptions.Issuer,
            Audience = _jwtAuthOptions.Audience
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