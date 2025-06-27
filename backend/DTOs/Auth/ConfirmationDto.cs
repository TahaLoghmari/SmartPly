namespace backend.DTOs.Email;

public record ConfirmationDto
{
    public string UserId { get; init; } 
    public string Token { get; init; }
}