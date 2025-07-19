using backend.DTOs.Resume;
using backend.Entities;

namespace backend.Mappings;

internal static class ResumeMappings
{
    public static Resume ToResume(this ResumeRequestDto dto, string userId, string resumeUrl )
    {
        return new Resume
        {
            UserId = userId,
            Name = dto.Name,
            ResumeUrl = resumeUrl,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Size = dto.File.Length,
        };
    }

    public static ResumeResponseDto ToResumeResponseDto(this Resume resume)
    {
        return new ResumeResponseDto
        {
            Id = resume.Id,
            UserId = resume.UserId,
            Name = resume.Name,
            CreatedAt = resume.CreatedAt,
            UpdatedAt = resume.UpdatedAt,
            ResumeUrl = resume.ResumeUrl,
            Size = resume.Size,
        };
    }

    public static void UpdateFromDto(this Resume resume, ResumeRequestDto dto)
    {
        resume.Name = dto.Name;
        resume.UpdatedAt = DateTime.UtcNow;
    }
}