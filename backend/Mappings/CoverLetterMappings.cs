using backend.DTOs;
using backend.Entities;

namespace backend.Mappings;

internal static class CoverLetterMappings
{
    public static CoverLetter ToCoverLetter(this CoverLetterRequestDto dto, string userId, string coverLetterUrl)
    {
        return new CoverLetter
        {
            UserId = userId,
            Name = dto.Name,
            Url = coverLetterUrl,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Size = dto.File.Length,
        };
    }

    public static CoverLetterResponseDto ToCoverLetterResponseDto(this CoverLetter coverLetter)
    {
        return new CoverLetterResponseDto
        {
            Id = coverLetter.Id,
            UserId = coverLetter.UserId,
            Name = coverLetter.Name,
            CreatedAt = coverLetter.CreatedAt,
            UpdatedAt = coverLetter.UpdatedAt,
            Url = coverLetter.Url,
            Size = coverLetter.Size,
        };
    }

    public static void UpdateFromDto(this CoverLetter coverLetter, CoverLetterRequestDto dto)
    {
        coverLetter.Name = dto.Name;
        coverLetter.UpdatedAt = DateTime.UtcNow;
    }
}

