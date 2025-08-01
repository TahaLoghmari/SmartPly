namespace backend.DTOs;

public record ConfirmationDto
{
    public string UserId { get; init; } 
    public string Token { get; init; }
}