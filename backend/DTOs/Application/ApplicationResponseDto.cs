using backend.Enums;

namespace backend.DTOs;

public sealed record ApplicationResponseDto 
{
    public Guid Id { get; set; }
    public Guid ResumeId { get; set; }
    public Guid? CoverLetterId { get; set; }
    public string UserId { get; init; }
    
    public string CompanyName { get; set; }
    public string? CompanyEmail { get; set; }
    public string Position { get; set; }
    public string Link { get; set; }
    public string? Notes { get; set; }
    public string Location { get; set; }
    public string? JobDescription { get; set; }
    public int StartSalary { get; set; }
    public int EndSalary { get; set; }
    public bool IsLiked { get; set; }
    public DateTime? Deadline { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; } 
    public DateTime? WishListDate { get; set; }
    public DateTime? AppliedDate { get; set; }
    public DateTime? InterviewDate { get; set; }
    public DateTime? OfferDate { get; set; }
    public DateTime? RejectedDate { get; set; }
    public DateTime? GhostedDate { get; set; }
    public ApplicationStatus Status { get; set; }
    public ApplicationType Type { get; set; }
    public ApplicationJobType JobType { get; set; }
    public ApplicationLevel Level { get; set; }
    public List<string>? TechnologiesUsed { get; set; }
}