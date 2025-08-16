using backend.DTOs;
using backend.Entities;
using backend.Exceptions;
using backend.Mappings;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace backend.Services;

public class CoverLetterService(
    ILogger<CoverLetterService> logger,
    ApplicationDbContext dbContext,
    IMemoryCache cache,
    CacheService cacheService,
    SupabaseService supabaseService,
    IBackgroundJobClient backgroundJobClient)
{
    public async Task<CoverLetterResponseDto> CreateCoverLetterAsync(
        CoverLetterRequestDto dto,
        string? userId,
        CancellationToken cancellationToken)
    {
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }

        string coverLetterUrl = await supabaseService.UploadFileAsync(dto.File,"coverLetter","cover-letters",cancellationToken);
        
        CoverLetter coverLetter = dto.ToCoverLetter(userId, coverLetterUrl);
        
        dbContext.CoverLetters.Add(coverLetter);
        await dbContext.SaveChangesAsync(cancellationToken);
        
        cacheService.InvalidateUserCoverLetterCache(coverLetter.UserId);
        
        logger.LogInformation("Cover letter created with ID {CoverLetterId}", coverLetter.Id);
        
        return coverLetter.ToCoverLetterResponseDto();
    }

    public async Task<ICollection<CoverLetterResponseDto>> GetUserCoverLetters(
        CoverLetterQueryParameters query,
        string? userId,
        CancellationToken cancellationToken)
    {
        if (userId is null)
        {
            logger.LogWarning("User ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }
        
        query.Search = query.Search?.Trim().ToLower();
        
        string cacheKey = cacheService.GenerateCoverLettersCacheKey(userId, query);
        logger.LogInformation("Fetching cover letters with name containing '{Search}' ", query.Search);
        if (cache.TryGetValue(cacheKey, out ICollection<CoverLetterResponseDto>? cachedResult))
        {
            logger.LogDebug("Cache hit for cover letters query: {CacheKey}", cacheKey);
            return cachedResult;
        }
        logger.LogDebug("Cache miss for cover letters query: {CacheKey}", cacheKey);
        
        ICollection<CoverLetterResponseDto> result = await dbContext.CoverLetters
            .AsNoTracking()
            .Where(r => r.UserId == userId)
            .Where(r => query.Search == null || r.Name.ToLower().Contains(query.Search))
            .Select(r => r.ToCoverLetterResponseDto())
            .ToListAsync(cancellationToken);
        
        cacheService.CacheCoverLettersResult(cacheKey, result, userId);
        return result;
    }

    public async Task<CoverLetterResponseDto> GetUserCoverLetter(
        Guid? id,
        string? userId,
        CancellationToken cancellationToken)
    {
        if (id == Guid.Empty || id is null )
        {
            logger.LogWarning("Invalid cover letter id provided.");
            throw new BadRequestException("The provided cover letter ID is invalid.");
        }
        
        if (userId is null)
        {
            logger.LogWarning("User ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }
        
        var coverLetter = await dbContext.CoverLetters
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId,cancellationToken);
        if (coverLetter is null)
        {
            logger.LogWarning("Cover letter not found for Id: {CoverLetterId}", id);
            throw new NotFoundException($"No Cover Letter found with ID '{id}'.");
        }
        return coverLetter.ToCoverLetterResponseDto();
    }

    public async Task EditCoverLetter(
        Guid? id,
        string? userId,
        CoverLetterRequestDto dto,
        CancellationToken cancellationToken)
    {
        if (id == Guid.Empty || id is null )
        {
            logger.LogWarning("Invalid cover letter id provided.");
            throw new BadRequestException("The provided cover letter ID is invalid.");
        }
        
        if (userId is null)
        {
            logger.LogWarning("User ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }
        
        var coverLetter = await dbContext.CoverLetters.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId,cancellationToken);
        if (coverLetter is null)
        {
            logger.LogWarning("Cover letter not found for Id: {CoverLetterId}", id);
            throw new NotFoundException($"No Cover Letter found with ID '{id}'.");
        }
        
        coverLetter.UpdateFromDto(dto);
        await dbContext.SaveChangesAsync(cancellationToken);
        cacheService.InvalidateUserCoverLetterCache(userId);
        logger.LogInformation("Cover letter edited with ID {CoverLetterId}", coverLetter.Id);
    }

    public async Task DeleteCoverLetter(
        Guid? id,
        string? userId,
        CancellationToken cancellationToken)
    {
        if (id == Guid.Empty || id is null )
        {
            logger.LogWarning("Invalid cover letter id provided.");
            throw new BadRequestException("The provided cover letter ID is invalid.");
        }
        
        if (userId is null)
        {
            logger.LogWarning("User ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }
        
        var coverLetter = await dbContext.CoverLetters.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId,cancellationToken);
        if (coverLetter is null)
        {
            logger.LogWarning("Cover letter not found for Id: {CoverLetterId}", id);
            throw new NotFoundException($"No Cover Letter found with ID '{id}'.");
        }
        
        dbContext.CoverLetters.Remove(coverLetter);
        await dbContext.SaveChangesAsync(cancellationToken);
        cacheService.InvalidateUserCoverLetterCache(userId);
        
        backgroundJobClient.Enqueue(() =>
            supabaseService.DeleteFileAsync(coverLetter.Url, "cover-letters"));
        
        logger.LogInformation("Cover letter deleted with ID {CoverLetterId}", coverLetter.Id);
    }

    public async Task BulkDeleteCoverLetters(
        List<Guid> coverLetterIds,
        string? userId,
        CancellationToken cancellationToken)
    {
        if (userId is null)
        {
            logger.LogWarning("User ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }
        
        var coverLetters = await dbContext.CoverLetters
            .Where(r => coverLetterIds.Contains(r.Id) && r.UserId == userId)
            .ToListAsync(cancellationToken);
        if (coverLetters.Count == 0)
        {
            logger.LogWarning("No cover letters found for bulk delete with IDs: {CoverLetterIds}", string.Join(", ", coverLetterIds));
            throw new NotFoundException("No cover letters found for the provided IDs.");
        }
        
        dbContext.CoverLetters.RemoveRange(coverLetters);
        await dbContext.SaveChangesAsync(cancellationToken);
        cacheService.InvalidateUserCoverLetterCache(userId);
        
        foreach (var coverLetter in coverLetters)
        {
            backgroundJobClient.Enqueue(() =>
                supabaseService.DeleteFileAsync(coverLetter.Url, "cover-letters"));
        }
        
        logger.LogInformation("Bulk deleted {Count} cover letters for user {UserId}", 
            coverLetters.Count, userId);
    }
    
    public async Task<DownloadResultDto> DownloadCoverLetter(
        Guid id,
        string? userId,
        CancellationToken cancellationToken)
    {
        var coverLetter = await GetUserCoverLetter(id, userId,cancellationToken);
        
        var bytes = await supabaseService.DownloadFileAsync(coverLetter.Url, "cover-letters");
        
        return new DownloadResultDto { Bytes = bytes, Name = coverLetter.Name };
    }
}

