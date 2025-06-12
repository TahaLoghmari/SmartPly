namespace backend.DTOs;

public sealed record UserDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; } 
}