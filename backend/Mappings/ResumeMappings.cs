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
            resumeUrl = resumeUrl,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
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
            resumeUrl = resume.resumeUrl
        };
    }

    public static void UpdateFromDto(this Resume resume, ResumeRequestDto dto)
    {
        resume.Name = dto.Name;
        resume.UpdatedAt = DateTime.UtcNow;
    }
}