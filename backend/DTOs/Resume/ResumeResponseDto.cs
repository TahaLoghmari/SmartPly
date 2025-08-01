using System;

namespace backend.DTOs;

public class ResumeResponseDto
{
    public Guid Id { get; set; }
    public string UserId { get; set; }
    public string Name { get; set; }
    public string ResumeUrl { get; set; }
    public long Size { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}