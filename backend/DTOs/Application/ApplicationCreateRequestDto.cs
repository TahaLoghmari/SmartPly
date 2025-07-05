using backend.Enums;
namespace backend.DTOs.Application;

public sealed record ApplicationCreateRequestDto
{
    public required Guid ResumeId { get; init; }
    public Guid? CoverLetterId { get; init; }
    public required string UserId { get; init; }
    
    public required string CompanyName { get; init; }
    public string? CompanyEmail { get; init; }
    public required string Position { get; init; }
    public required string Link { get; init; }
    public string? Notes { get; init; }
    public required string Location { get; init; }
    public required int StartSalary { get; init; }
    public required int EndSalary { get; init; }
    public DateTime? Deadline { get; init; }
    public string? JobDescription { get; init; }
    public required ApplicationStatus Status { get; init; }
    public required ApplicationType Type { get; init; }
    public required ApplicationJobType JobType { get; init; }
    public required ApplicationLevel Level { get; init; }
    public List<string>? TechnologiesUsed { get; init; }
}