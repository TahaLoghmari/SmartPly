using Microsoft.AspNetCore.Identity;

namespace backend.Entities;

public sealed class User : IdentityUser 
{
    public required string Name { get; set; }
    public string? ImageUrl { get; set; }
}