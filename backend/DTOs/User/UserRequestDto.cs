namespace backend.DTOs;

public record UserRequestDto
{
    public string? Name { get; set; } = string.Empty;
    public string? CurrentPassword { get; set; } = string.Empty;
    public string? Password { get; set; } = string.Empty;
    public string? ConfirmPassword { get; set; } = string.Empty;
}