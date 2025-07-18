using System;

namespace backend.DTOs.Resume;

public class ResumeResponseDto
{
    public Guid Id { get; set; }
    public string UserId { get; set; }
    public string Name { get; set; }
    public string resumeUrl { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}