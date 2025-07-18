using backend.DTOs.Resume;
using backend.DTOs.Shared;
using backend.Entities;
using backend.Mappings;
using backend.Services.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace backend.Services;

public class ResumeService(
    ILogger<ResumeService> logger,
    ApplicationDbContext dbContext,
    IMemoryCache cache,
    CacheService cacheService,
    SupabaseService supabaseService)
{
    public async Task<ResumeResponseDto> CreateResumeAsync(ResumeRequestDto dto, string userId )
    {
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }

        string resumeUrl = await supabaseService.UploadFileAsync(dto.File);
        
        Resume resume = dto.ToResume(userId,resumeUrl);
        
        dbContext.Resumes.Add(resume);
        
        await dbContext.SaveChangesAsync();
        
        cacheService.InvalidateUserResumeCache(resume.UserId);
        
        logger.LogInformation("Resume created with ID {ResumeId}", resume.Id);
        
        return resume.ToResumeResponseDto();
    }

    public async Task<ICollection<ResumeResponseDto>> GetUserResumes(
        ResumeQueryParameters query, string? userId)
    {
        if (userId is null)
        {
            logger.LogWarning("User ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }

        query.Search = query.Search?.Trim().ToLower();
        string cacheKey = cacheService.GenerateResumesCacheKey(userId, query);
        logger.LogInformation("Fetching resumes with name containing '{Search}' ", query.Search);

        if (cache.TryGetValue(cacheKey, out ICollection<ResumeResponseDto>? cachedResult))
        {
            logger.LogDebug("Cache hit for resumes query: {CacheKey}", cacheKey);
            return cachedResult;
        }

        logger.LogDebug("Cache miss for resumes query: {CacheKey}", cacheKey);
        
        ICollection<ResumeResponseDto> result = await dbContext.Resumes
            .AsNoTracking()
            .Where(r => r.UserId == userId)
            .Where(r => query.Search == null || r.Name.ToLower().Contains(query.Search))
            .Select(r => r.ToResumeResponseDto())
            .ToListAsync();

        cacheService.CacheResumesResult(cacheKey, result, userId);

        return result;
    }

    public async Task<ResumeResponseDto> GetUserResume(Guid id, string? userId)
    {
        if (id == Guid.Empty)
        {
            logger.LogWarning("Invalid resume id provided.");
            throw new BadRequestException("The provided resume ID is invalid.");
        }

        if (userId is null)
        {
            logger.LogWarning("User ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }

        var resume = await dbContext.Resumes
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

        if (resume is null)
        {
            logger.LogWarning("Resume not found for Id: {ResumeId}", id);
            throw new NotFoundException($"No Resume found with ID '{id}'.");
        }

        return resume.ToResumeResponseDto();
    }

    public async Task EditResume(Guid id, string? userId, ResumeRequestDto dto)
    {
        if (id == Guid.Empty)
        {
            logger.LogWarning("Invalid resume id provided.");
            throw new BadRequestException("The provided resume ID is invalid.");
        }

        if (userId is null)
        {
            logger.LogWarning("User ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }

        var resume = await dbContext.Resumes.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

        if (resume is null)
        {
            logger.LogWarning("Resume not found for Id: {ResumeId}", id);
            throw new NotFoundException($"No Resume found with ID '{id}'.");
        }

        resume.UpdateFromDto(dto);
        await dbContext.SaveChangesAsync();
        cacheService.InvalidateUserResumeCache(userId);
        logger.LogInformation("Resume edited with ID {ResumeId}", resume.Id);
    }

    public async Task DeleteResume(Guid id, string? userId)
    {
        if (id == Guid.Empty)
        {
            logger.LogWarning("Invalid resume id provided.");
            throw new BadRequestException("The provided resume ID is invalid.");
        }

        if (userId is null)
        {
            logger.LogWarning("User ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }

        var resume = await dbContext.Resumes.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);

        if (resume is null)
        {
            logger.LogWarning("Resume not found for Id: {ResumeId}", id);
            throw new NotFoundException($"No Resume found with ID '{id}'.");
        }

        dbContext.Resumes.Remove(resume);
        await dbContext.SaveChangesAsync();
        cacheService.InvalidateUserResumeCache(userId);
        logger.LogInformation("Resume deleted with ID {ResumeId}", resume.Id);
    }
}