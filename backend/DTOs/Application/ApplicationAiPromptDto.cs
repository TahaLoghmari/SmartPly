using backend.Enums;

namespace backend.DTOs;

public record ApplicationAiPromptDto
{
    public Guid Id { get; set; }
    public string CompanyName { get; set; }
    public string? CompanyEmail { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? JobDescription { get; set; }
    public ApplicationJobType JobType { get; set; }
    public ApplicationLevel Level { get; set; }
    public string Link { get; set; }
    public string Location { get; set; }
    public string? Notes { get; set; }
    public string Position { get; set; }
    public ApplicationStatus Status { get; set; }
    public ApplicationType Type { get; set; }
}