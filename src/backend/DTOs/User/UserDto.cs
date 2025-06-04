namespace backend.DTOs;

public sealed record UserDto
{
    public string Id { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; } 
}