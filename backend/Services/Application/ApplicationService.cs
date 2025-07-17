using System.Collections.Concurrent;
using System.Security.Claims;
using backend.DTOs.Application;
using backend.DTOs.Shared;
using backend.Entities;
using backend.Enums;
using backend.Mappings;
using backend.Services.Shared;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace backend.Services;

public class ApplicationService( 
    ILogger<ApplicationService> logger,
    ApplicationDbContext dbContext,
    IMemoryCache cache,
    CacheService cacheService)
{
    public async Task<ApplicationResponseDto> CreateApplicationAsync(
        ApplicationRequestDto applicationRequestDto)
    {
        Application application = applicationRequestDto.ToApplication();
        
        dbContext.Applications.Add(application);
        
        Resume? resume = await dbContext.Resumes
            .FirstOrDefaultAsync(r => r.Id == applicationRequestDto.ResumeId && r.UserId == applicationRequestDto.UserId);
        
        if (resume is null)
        {
            logger.LogWarning("Create application failed - resume not found for Id: {ResumeId}", applicationRequestDto.ResumeId);
            throw new NotFoundException($"No Resume found with ID '{applicationRequestDto.ResumeId}'.");
        }

        resume.ApplicationsCount++;
        
        await dbContext.SaveChangesAsync();
        
        cacheService.InvalidateUserApplicationCache(application.UserId);
        
        logger.LogInformation("Application created with ID {ApplicationId}", application.Id);

        return (application.ToApplicationResponseDto());
    }
    
    public async Task<PaginationResult<ApplicationResponseDto>> GetUserApplications( 
        ApplicationQueryParameters query,
        string? userId)
    {
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }

        logger.LogInformation("Retrieving applications for user with ID {UserId}", userId); 

        query.Search = query.Search?.Trim().ToLower();

        string cacheKey = cacheService.GenerateApplicationsCacheKey(userId, query);
        
        if (cache.TryGetValue(cacheKey, out PaginationResult<ApplicationResponseDto>? cachedResult))
        {
            logger.LogDebug("Cache hit for applications query: {CacheKey}", cacheKey);
            return cachedResult;
        }
        
        logger.LogDebug("Cache miss for applications query: {CacheKey}", cacheKey);

        IQueryable<ApplicationResponseDto> applicationQuery = dbContext.Applications
            .AsNoTracking()
            .Where(a => query.Search == null || a.CompanyName.ToLower().Contains(query.Search) ||
                        a.Position.ToLower().Contains(query.Search) ||
                        a.JobDescription != null && a.JobDescription.ToLower().Contains(query.Search) == true)
            .Where(a => a.UserId == userId)
            .Where(a => query.Status == null || a.Status == query.Status)
            .Where(a => query.Level == null || a.Level == query.Level)
            .Where(a => query.Type == null || a.Type == query.Type)
            .Where(a => query.JobType == null || a.JobType == query.JobType)
            .Select(a => a.ToApplicationResponseDto());
        
        var paginationResult = await PaginationResult<ApplicationResponseDto>.CreateAsync(
            applicationQuery, query.Page ?? 1, query.PageSize ?? 8);
        
        cacheService.CacheApplicationsResult(cacheKey, paginationResult, userId);
        
        return paginationResult;
    }
    public async Task<ApplicationResponseDto> GetUserApplication(
        Guid id, string? userId )
    {
        if (id == Guid.Empty)
        {
            logger.LogWarning("Invalid application id provided.");
            throw new BadRequestException("The provided application ID is invalid.");
        }
        
        logger.LogInformation("Retrieving application with ID {ApplicationId}", id);

        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }
        
        Application? application = await dbContext.Applications
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (application is null)
        {
            logger.LogWarning("Get current application failed - application not found for Id: {applicationId}", id);
            throw new NotFoundException($"No Application found with ID '{id}'.");
        }
        
        logger.LogInformation("Application Retrieved with ID {ApplicationId}", application.Id);
        
        return application.ToApplicationResponseDto();
    }
    
    public async Task EditApplication(
        Guid id,
        string? userId,
        ApplicationRequestDto applicationEditRequestDto)
    {
        if (id == Guid.Empty)
        {
            logger.LogWarning("Invalid application id provided.");
            throw new BadRequestException("The provided application ID is invalid.");
        }
        
        logger.LogInformation("Starting application editing for user {UserId}", applicationEditRequestDto.UserId);

        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }
        
        Application? application = await dbContext.Applications.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (application is null)
        {
            logger.LogWarning("Get current application failed - application not found for Id: {applicationId}", id);
            throw new NotFoundException($"No Application found with ID '{id}'.");
        }
        
        Resume? oldResume = await dbContext.Resumes
            .FirstOrDefaultAsync(r => r.Id == application.ResumeId && r.UserId == application.UserId);
        
        if (oldResume is null)
        {
            logger.LogWarning("Editing application failed - resume not found for Id: {ResumeId}", application.ResumeId);
            throw new NotFoundException($"No Resume found with ID '{application.ResumeId}'.");
        }

        oldResume.ApplicationsCount--;
        logger.LogInformation("Decremented ApplicationsCount for old ResumeId: {OldResumeId}, NewCount: {ApplicationsCount}", oldResume.Id, oldResume.ApplicationsCount);
        
        Resume? newResume = await dbContext.Resumes
            .FirstOrDefaultAsync(r => r.Id == applicationEditRequestDto.ResumeId && r.UserId == applicationEditRequestDto.UserId);
        
        if (newResume is null)
        {
            logger.LogWarning("Editing application failed - resume not found for Id: {ResumeId}", applicationEditRequestDto.ResumeId);
            throw new NotFoundException($"No Resume found with ID '{applicationEditRequestDto.ResumeId}'.");
        }
        
        newResume.ApplicationsCount++;
        logger.LogInformation("Incremented ApplicationsCount for new ResumeId: {NewResumeId}, NewCount: {ApplicationsCount}", newResume.Id, newResume.ApplicationsCount);
        
        application.UpdateFromDto(applicationEditRequestDto);
        logger.LogInformation("Updated application entity from DTO. ApplicationId: {ApplicationId}", application.Id);
        
        await dbContext.SaveChangesAsync();
        
        cacheService.InvalidateUserApplicationCache(userId);

        logger.LogInformation("Application edited with ID {ApplicationId}", application.Id);
    }
    
    public async Task DeleteApplication(
        Guid id,
        string? userId)
    {
        if (id == Guid.Empty)
        {
            logger.LogWarning("Invalid application id provided.");
            throw new BadRequestException("The provided application ID is invalid.");
        }
        
        logger.LogInformation("Deleting application with ID {ApplicationId}", id);

        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }
        
        Application? application = await dbContext.Applications
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (application is null)
        {
            logger.LogWarning("Get current application failed - application not found for Id: {applicationId}", id);
            throw new NotFoundException($"No Application found with ID '{id}'.");
        }
        
        Resume? resume = await dbContext.Resumes
            .FirstOrDefaultAsync(r => r.Id == application.ResumeId && r.UserId == application.UserId);
        
        if (resume is null)
        {
            logger.LogWarning("Create application failed - resume not found for Id: {ResumeId}", application.ResumeId);
            throw new NotFoundException($"No Resume found with ID '{application.ResumeId}'.");
        }

        resume.ApplicationsCount--;
        logger.LogInformation("Decremented ApplicationsCount for ResumeId: {ResumeId}, NewCount: {ApplicationsCount}", resume.Id, resume.ApplicationsCount);
        
        dbContext.Applications.Remove(application);
        await dbContext.SaveChangesAsync();
        
        cacheService.InvalidateUserApplicationCache(userId);
        
        logger.LogInformation("Application deleted with ID {ApplicationId}", application.Id);
    }

    public async Task<ApplicationStatsDto> GetApplicationStats(
        string? userId)
    {
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }

        var stats = await dbContext.Applications
            .AsNoTracking()
            .Where(a => a.UserId == userId)
            .GroupBy(a => a.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync();

        var result = new ApplicationStatsDto
        {
            TotalOffers = stats.FirstOrDefault(s => s.Status == ApplicationStatus.offer)?.Count ?? 0,
            TotalGhosted = stats.FirstOrDefault(s => s.Status == ApplicationStatus.ghosted)?.Count ?? 0,
            TotalInterviewing = stats.FirstOrDefault(s => s.Status == ApplicationStatus.interviewing)?.Count ?? 0,
            TotalWishList = stats.FirstOrDefault(s => s.Status == ApplicationStatus.wishList)?.Count ?? 0,
            TotalApplied = stats.FirstOrDefault(s => s.Status == ApplicationStatus.applied)?.Count ?? 0,
            TotalRejected = stats.FirstOrDefault(s => s.Status == ApplicationStatus.rejected)?.Count ?? 0,
        };

        return result;
    }
}