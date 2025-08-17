using Microsoft.AspNetCore.Identity;

namespace backend.Entities;

public sealed class User : IdentityUser 
{
    public required string Name { get; set; }
    public string? GoogleEmail { get; set; } 
    public string? ImageUrl { get; set; }
    public bool? GmailConnected { get; set; }
    public DateTime? LastSyncedAt { get; set; }
    public bool IsInitialSyncComplete { get; set; }
    public bool IsInitialSyncStarted { get; set; }
    public bool IsRecurringSyncScheduled { get; set; }
    public bool IsRecurringCleanupScheduled { get; set; }
    public ICollection<Application>? Applications { get; set; } = new List<Application>();
    public ICollection<Email>? Emails { get; set; } = new List<Email>();
    public ICollection<Resume> Resumes { get; set; } = new List<Resume>();
    public ICollection<CoverLetter> CoverLetters { get; set; } = new List<CoverLetter>();
}