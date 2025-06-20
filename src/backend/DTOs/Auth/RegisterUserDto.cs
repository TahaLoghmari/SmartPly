namespace backend.DTOs;
public sealed record RegisterUserDto
{
    public string Email { get; init; }
    public string Name { get; init; }
    public string Password { get; init; }
    public string ConfirmPassword { get; init; }
}