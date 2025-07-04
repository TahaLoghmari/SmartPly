using backend.Enums;

namespace backend.Entities;

public sealed class Application
{
    public Guid? Id { get; set; } = Guid.NewGuid();
    public Guid ResumeId { get; set; }
    public Guid CoverLetterId { get; set; }
    public string UserId { get; set; }
    
    public string? CompanyName { get; set; }
    public string? CompanyEmail { get; set; }
    public string? Position { get; set; }
    public string? Link { get; set; }
    public string? Notes { get; set; }
    public string? Location { get; set; }
    public int? StartSalary { get; set; }
    public int? EndSalary { get; set; }
    public DateTime Deadline { get; set; } 
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; } 
    public string? JobDescription { get; set; } 
    
    public ApplicationStatus? Status { get; set; }
    public ApplicationType? Type { get; set; }
    public ApplicationJobType? JobType { get; set; } 
    public ApplicationLevel? Level { get; set; } 
    public List<string>? TechnologiesUsed { get; set; } = new List<string>();
    
    public Resume? ResumeUsed { get; set; } 
    public User? User { get; set; }
    public CoverLetter? CoverLetterUsed { get; set; }
    public ICollection<Contact>? Contacts { get; set; } = new List<Contact>();
}
