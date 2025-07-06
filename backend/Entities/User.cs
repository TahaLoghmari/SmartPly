using Microsoft.AspNetCore.Identity;

namespace backend.Entities;

public sealed class User : IdentityUser 
{
    public required string Name { get; set; }
    public string? GoogleEmail { get; set; }
    public string? ImageUrl { get; set; }
    public bool? GmailConnected { get; set; }
    
    public ICollection<Application>? Applications { get; set; } = new List<Application>();
    public ICollection<Resume> Resumes { get; set; } = new List<Resume>();
    public ICollection<CoverLetter> CoverLetters { get; set; } = new List<CoverLetter>();
}