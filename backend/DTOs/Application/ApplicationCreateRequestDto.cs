using backend.Enums;
namespace backend.DTOs.Application;

public sealed record ApplicationCreateRequestDto
{
    public Guid ResumeId { get; init; }
    public Guid? CoverLetterId { get; init; }
    public string UserId { get; init; }
    
    public string CompanyName { get; init; }
    public string? CompanyEmail { get; init; }
    public string Position { get; init; }
    public string Link { get; init; }
    public string? Notes { get; init; }
    public string Location { get; init; }
    public int StartSalary { get; init; }
    public int EndSalary { get; init; }
    public DateTime? Deadline { get; init; }
    public string? JobDescription { get; init; }
    public ApplicationStatus Status { get; init; }
    public ApplicationType Type { get; init; }
    public ApplicationJobType JobType { get; init; }
    public ApplicationLevel Level { get; init; }
    public List<string>? TechnologiesUsed { get; init; }
}