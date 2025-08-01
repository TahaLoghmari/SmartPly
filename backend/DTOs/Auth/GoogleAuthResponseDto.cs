namespace backend.DTOs;

public record GoogleAuthResponseDto
{
    public string AuthorizationUrl { get; init; }
}