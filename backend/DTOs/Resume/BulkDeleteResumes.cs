namespace backend.DTOs.Resume;

public record BulkDeleteRequestDto
{
    public List<Guid> ResumeIds { get; set; }
}