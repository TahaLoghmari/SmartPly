namespace backend.DTOs.Auth;

public record ResetPasswordResultDto
{
    public string Token { get; set; }
    public string Email { get; set; }
}