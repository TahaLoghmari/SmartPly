using backend.DTOs;
using backend.DTOs.Application;
using backend.Entities;
using backend.Enums;

namespace backend.Mappings;

internal static class ApplicationMappings
{
    public static Application ToApplication(
        this ApplicationRequestDto applicationRequestDto, string userId)
    {
        Application application = new Application
        {
            ResumeId = applicationRequestDto.ResumeId,
            CoverLetterId = applicationRequestDto.CoverLetterId,
            UserId = userId,
            CompanyName = applicationRequestDto.CompanyName,
            CompanyEmail = applicationRequestDto.CompanyEmail,
            Position = applicationRequestDto.Position,
            Link = applicationRequestDto.Link,
            Location = applicationRequestDto.Location,
            StartSalary = applicationRequestDto.StartSalary,
            EndSalary = applicationRequestDto.EndSalary,
            Deadline = applicationRequestDto.Deadline,
            Status = applicationRequestDto.Status,
            Type = applicationRequestDto.Type,
            JobType = applicationRequestDto.JobType,
            Level = applicationRequestDto.Level,
            TechnologiesUsed = applicationRequestDto.TechnologiesUsed?.ToList() ?? new List<string>(),
            Notes = applicationRequestDto.Notes,
            JobDescription = applicationRequestDto.JobDescription,
        };
        switch (application.Status)
        {
            case ApplicationStatus.wishList:
                application.WishListDate = DateTime.UtcNow;
                break;
            case ApplicationStatus.applied:
                application.AppliedDate = DateTime.UtcNow;
                break;
            case ApplicationStatus.interview:
                application.InterviewDate = DateTime.UtcNow;
                break;
            case ApplicationStatus.offer:
                application.OfferDate = DateTime.UtcNow;
                break;
            case ApplicationStatus.rejected:
                application.RejectedDate = DateTime.UtcNow;
                break;
            case ApplicationStatus.ghosted:
                application.GhostedDate = DateTime.UtcNow;
                break;
        }

        return application;
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
            TechnologiesUsed = application.TechnologiesUsed?.ToList(),
            WishListDate = application.WishListDate,
            AppliedDate = application.AppliedDate,
            InterviewDate = application.InterviewDate,
            OfferDate = application.OfferDate,
            RejectedDate = application.RejectedDate,
            GhostedDate = application.GhostedDate,
        };
    }
    public static void UpdateFromDto(this Application application, ApplicationRequestDto dto)
    {
        application.ResumeId = dto.ResumeId;
        application.CoverLetterId = dto.CoverLetterId;
        application.CompanyName = dto.CompanyName;
        application.CompanyEmail = dto.CompanyEmail;
        application.Position = dto.Position;
        application.Link = dto.Link;
        application.Notes = dto.Notes;
        application.Location = dto.Location;
        application.StartSalary = dto.StartSalary;
        application.EndSalary = dto.EndSalary;
        application.Deadline = dto.Deadline;
        application.JobDescription = dto.JobDescription;
        application.Status = dto.Status;
        application.Type = dto.Type;
        application.JobType = dto.JobType;
        application.Level = dto.Level;
        application.TechnologiesUsed = dto.TechnologiesUsed?.ToList() ?? new List<string>();
        application.UpdatedAt = DateTime.UtcNow;
        application.WishListDate = dto.WishListDate;
        application.AppliedDate = dto.AppliedDate;
        application.InterviewDate = dto.InterviewDate;
        application.OfferDate = dto.OfferDate;
        application.RejectedDate = dto.RejectedDate;
        application.GhostedDate = dto.GhostedDate;
    }
}