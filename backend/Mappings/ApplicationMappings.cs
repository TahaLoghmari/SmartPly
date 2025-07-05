using backend.DTOs;
using backend.DTOs.Application;
using backend.Entities;

namespace backend.Mappings;

internal static class ApplicationMappings
{
    public static Application ToApplication(
        this ApplicationCreateRequestDto applicationCreateRequestDto)
    {
        return new Application
        {
            ResumeId = applicationCreateRequestDto.ResumeId,
            CoverLetterId = applicationCreateRequestDto.CoverLetterId,
            UserId = applicationCreateRequestDto.UserId,
            CompanyName = applicationCreateRequestDto.CompanyName,
            CompanyEmail = applicationCreateRequestDto.CompanyEmail,
            Position = applicationCreateRequestDto.Position,
            Link = applicationCreateRequestDto.Link,
            Location = applicationCreateRequestDto.Location,
            StartSalary = applicationCreateRequestDto.StartSalary,
            EndSalary = applicationCreateRequestDto.EndSalary,
            Deadline = applicationCreateRequestDto.Deadline,
            Status = applicationCreateRequestDto.Status,
            Type = applicationCreateRequestDto.Type,
            JobType = applicationCreateRequestDto.JobType,
            Level = applicationCreateRequestDto.Level,
            TechnologiesUsed = applicationCreateRequestDto.TechnologiesUsed?.ToList() ?? new List<string>(),
            Notes = applicationCreateRequestDto.Notes,
            JobDescription = applicationCreateRequestDto.JobDescription,
        };
    }

    public static ApplicationResponseDto ToApplicationResponseDto(this Application application)
    {
        return new ApplicationResponseDto
        {
            Id = application.Id,
            ResumeId = application.ResumeId,
            CoverLetterId = application.CoverLetterId,
            UserId = application.UserId,
            CompanyName = application.CompanyName,
            CompanyEmail = application.CompanyEmail,
            Position = application.Position,
            Link = application.Link,
            Notes = application.Notes,
            Location = application.Location,
            StartSalary = application.StartSalary,
            EndSalary = application.EndSalary,
            Deadline = application.Deadline,
            CreatedAt = application.CreatedAt,
            UpdatedAt = application.UpdatedAt,
            JobDescription = application.JobDescription,
            Status = application.Status,
            Type = application.Type,
            JobType = application.JobType,
            Level = application.Level,
            TechnologiesUsed = application.TechnologiesUsed?.ToList()
        };
    }
}