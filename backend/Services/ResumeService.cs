using backend.DTOs;
using backend.Entities;
using backend.Exceptions;
using backend.Mappings;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace backend.Services;

public class ResumeService(
    ILogger<ResumeService> logger,
    ApplicationDbContext dbContext,
    IMemoryCache cache,
    CacheService cacheService,
    SupabaseService supabaseService,
    IBackgroundJobClient backgroundJobClient)
{
    public async Task<ResumeResponseDto> CreateResumeAsync(
        ResumeRequestDto dto,
        string? userId,
        CancellationToken cancellationToken)
    {
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }

        string resumeUrl = await supabaseService.UploadFileAsync(dto.File,"resume","resumes",cancellationToken);
        
        Resume resume = dto.ToResume(userId,resumeUrl);
        
        dbContext.Resumes.Add(resume);
        
        await dbContext.SaveChangesAsync(cancellationToken);
        
        cacheService.InvalidateUserResumeCache(resume.UserId);
        
        logger.LogInformation("Resume created with ID {ResumeId}", resume.Id);
        
        return resume.ToResumeResponseDto();
    }

    public async Task<ICollection<ResumeResponseDto>> GetUserResumes(
        ResumeQueryParameters query,
        string? userId,
        CancellationToken cancellationToken)
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
            .ToListAsync(cancellationToken);

        cacheService.CacheResumesResult(cacheKey, result, userId);

        return result;
    }

    public async Task<ResumeResponseDto> GetUserResume(
        Guid? id,
        string? userId,
        CancellationToken cancellationToken)
    {
        if (id == Guid.Empty || id is null )
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
            .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId,cancellationToken);
        if (resume is null)
        {
            logger.LogWarning("Resume not found for Id: {ResumeId}", id);
            throw new NotFoundException($"No Resume found with ID '{id}'.");
        }

        return resume.ToResumeResponseDto();
    }

    public async Task EditResume(
        Guid? id,
        string? userId,
        ResumeRequestDto dto,
        CancellationToken cancellationToken)
    {
        if (id == Guid.Empty || id is null )
        {
            logger.LogWarning("Invalid resume id provided.");
            throw new BadRequestException("The provided resume ID is invalid.");
        }

        if (userId is null)
        {
            logger.LogWarning("User ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }

        var resume = await dbContext.Resumes.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId,cancellationToken);

        if (resume is null)
        {
            logger.LogWarning("Resume not found for Id: {ResumeId}", id);
            throw new NotFoundException($"No Resume found with ID '{id}'.");
        }

        resume.UpdateFromDto(dto);
        await dbContext.SaveChangesAsync(cancellationToken);
        cacheService.InvalidateUserResumeCache(userId);
        logger.LogInformation("Resume edited with ID {ResumeId}", resume.Id);
    }

    public async Task DeleteResume(
        Guid? id,
        string? userId,
        CancellationToken cancellationToken)
    {
        if (id == Guid.Empty || id is null )
        {
            logger.LogWarning("Invalid resume id provided.");
            throw new BadRequestException("The provided resume ID is invalid.");
        }

        if (userId is null)
        {
            logger.LogWarning("User ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }

        var resume = await dbContext.Resumes.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId,cancellationToken);

        if (resume is null)
        {
            logger.LogWarning("Resume not found for Id: {ResumeId}", id);
            throw new NotFoundException($"No Resume found with ID '{id}'.");
        }
        
        dbContext.Resumes.Remove(resume);
        await dbContext.SaveChangesAsync(cancellationToken);
        cacheService.InvalidateUserResumeCache(userId);

        backgroundJobClient.Enqueue(() =>
            supabaseService.DeleteFileAsync(userId,resume.Url, "resumes"));
        
        logger.LogInformation("Resume deleted with ID {ResumeId}", resume.Id);
    }
    
    public async Task BulkDeleteResumes(
        List<Guid> resumeIds,
        string? userId,
        CancellationToken cancellationToken)
    {
        if (userId is null)
        {
            logger.LogWarning("User ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }
        
        var resumes = await dbContext.Resumes
            .Where(r => resumeIds.Contains(r.Id) && r.UserId == userId)
            .ToListAsync(cancellationToken);
        if (resumes.Count == 0)
        {
            logger.LogWarning("No resumes found for bulk delete with IDs: {ResumeIds}", string.Join(", ", resumeIds));
            throw new NotFoundException("No resumes found for the provided IDs.");
        }
        
        dbContext.Resumes.RemoveRange(resumes);
        await dbContext.SaveChangesAsync(cancellationToken);
        cacheService.InvalidateUserResumeCache(userId);
        
        foreach (var resume in resumes)
        {
            backgroundJobClient.Enqueue(() =>
                supabaseService.DeleteFileAsync(userId,resume.Url, "resumes"));
        }
        
        logger.LogInformation("Bulk deleted {Count} resumes for user {UserId}",
            resumes.Count, userId);
    }
    
    public async Task<DownloadResultDto> DownloadResume(
        Guid id,
        string? userId,
        CancellationToken cancellationToken)
    {
        var resume = await GetUserResume(id, userId,cancellationToken);
        
        var bytes = await supabaseService.DownloadFileAsync(resume.Url, "resumes");
        
        return new DownloadResultDto { Bytes = bytes, Name = resume.Name };
    }
}