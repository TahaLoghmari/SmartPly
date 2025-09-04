using backend.DTOs;
using backend.Entities;
using backend.Enums;
using backend.Exceptions;
using backend.Mappings;
using backend.Utilities;
using FluentValidation;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
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
        ApplicationRequestDto applicationRequestDto,
        string? userId,
        CancellationToken cancellationToken)
    {
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }
        
        Application application = applicationRequestDto.ToApplication(userId);
        
        foreach (ApplicationStatus status in Enum.GetValues(typeof(ApplicationStatus)))
        {
            if (status <= application.Status)
            {
                ApplicationUtilities.UpdateApplicationStatusDate(application, status.ToString());
            }
        }
        
        dbContext.Applications.Add(application);
        
        await dbContext.SaveChangesAsync(cancellationToken);
        
        cacheService.InvalidateUserApplicationCache(application.UserId);
        
        logger.LogInformation("Application created with ID {ApplicationId}", application.Id);

        return (application.ToApplicationResponseDto());
    }
    
    public async Task<PaginationResultDto<ApplicationResponseDto>> GetApplicationsAsync( 
        ApplicationQueryParameters query,
        string? userId,
        CancellationToken cancellationToken)
    {
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }

        logger.LogInformation("Retrieving applications for user with ID {UserId}", userId); 

        query.Search = query.Search?.Trim().ToLower();

        string cacheKey = cacheService.GenerateApplicationsCacheKey(userId, query);
        
        if (cache.TryGetValue(cacheKey, out PaginationResultDto<ApplicationResponseDto>? cachedResult))
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
            .OrderBy(a => a.CreatedAt)
            .Select(a => a.ToApplicationResponseDto());
        
        var paginationResult = await PaginationResultDto<ApplicationResponseDto>.CreateAsync(
            applicationQuery, query.Page ?? 1, query.PageSize ?? 8,cancellationToken);
        
        cacheService.CacheApplicationsResult(cacheKey, paginationResult, userId);
        
        return paginationResult;
    }
    public async Task<ApplicationResponseDto> GetApplicationAsync(
        Guid? id, 
        string? userId,
        CancellationToken cancellationToken)
    {
        if (id == Guid.Empty || id is null )
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
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId,cancellationToken);

        if (application is null)
        {
            logger.LogWarning("Get current application failed - application not found for Id: {applicationId}", id);
            throw new NotFoundException($"No Application found with ID '{id}'.");
        }
        
        logger.LogInformation("Application Retrieved with ID {ApplicationId}", application.Id);
        
        return application.ToApplicationResponseDto();
    }
    
    public async Task EditApplicationAsync(
        Guid? id,
        string? userId,
        ApplicationRequestDto applicationEditRequestDto,
        CancellationToken cancellationToken)
    {
        if (id == Guid.Empty || id is null )
        {
            logger.LogWarning("Invalid application id provided.");
            throw new BadRequestException("The provided application ID is invalid.");
        }
        
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }
        
        logger.LogInformation("Starting application editing for user {UserId}", userId);
        
        Application? application = await dbContext.Applications.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId,cancellationToken);

        if (application is null)
        {
            logger.LogWarning("Get current application failed - application not found for Id: {applicationId}", id);
            throw new NotFoundException($"No Application found with ID '{id}'.");
        }
        
        application.UpdateFromDto(applicationEditRequestDto);

        foreach (ApplicationStatus status in Enum.GetValues(typeof(ApplicationStatus)))
        {
            if (status <= application.Status)
            {
                ApplicationUtilities.UpdateApplicationStatusDate(application, status.ToString());
            }
        }
        foreach (ApplicationStatus status in Enum.GetValues(typeof(ApplicationStatus)))
        {
            if (status > application.Status)
            {
                ApplicationUtilities.UpdateApplicationStatusDate(application, status.ToString(),true);
            }
        }
        logger.LogInformation("Updated application entity from DTO. ApplicationId: {ApplicationId}", application.Id);
        
        await dbContext.SaveChangesAsync(cancellationToken);
        
        cacheService.InvalidateUserApplicationCache(userId);

        logger.LogInformation("Application edited with ID {ApplicationId}", application.Id);
    }
    
    public async Task PatchApplicationAsync(
        Guid? id,
        string? userId,
        JsonPatchDocument<ApplicationRequestDto> patchDoc,
        IValidator<ApplicationRequestDto> validator,
        ModelStateDictionary modelState,
        CancellationToken cancellationToken)
    {
        if (id == Guid.Empty || id is null )
        {
            logger.LogWarning("Invalid application id provided.");
            throw new BadRequestException("The provided application ID is invalid.");
        }
        
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }
        
        logger.LogInformation("Starting application patching for user {UserId}", userId);
        
        Application? application = await dbContext.Applications.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId,cancellationToken);

        if (application is null)
        {
            logger.LogWarning("Get current application failed - application not found for Id: {applicationId}", id);
            throw new NotFoundException($"No Application found with ID '{id}'.");
        }
        
        ApplicationRequestDto applicationDto = application.ToApplicationRequestDto();
        
        patchDoc.ApplyTo(applicationDto, modelState);
        
        if (!modelState.IsValid)
        {
            var errors = modelState
                .SelectMany(x => x.Value.Errors)
                .Select(x => x.ErrorMessage);
            throw new BadRequestException($"Invalid patch operations: {string.Join(", ", errors)}");
        }
        
        await validator.ValidateAndThrowAsync(applicationDto,cancellationToken);
        
        application.UpdateFromDto(applicationDto);
        
        await dbContext.SaveChangesAsync(cancellationToken);
        
        cacheService.InvalidateUserApplicationCache(userId);
        
        logger.LogInformation("Application patched with ID {ApplicationId}", application.Id);
    }
    
    public async Task DeleteApplicationAsync(
        Guid? id,
        string? userId,
        CancellationToken cancellationToken)
    {
        if (id == Guid.Empty || id is null )
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
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId,cancellationToken);

        if (application is null)
        {
            logger.LogWarning("Get current application failed - application not found for Id: {applicationId}", id);
            throw new NotFoundException($"No Application found with ID '{id}'.");
        }
        
        dbContext.Applications.Remove(application);
        await dbContext.SaveChangesAsync(cancellationToken);
        
        cacheService.InvalidateUserApplicationCache(userId);
        
        logger.LogInformation("Application deleted with ID {ApplicationId}", application.Id);
    }

    public async Task BulkDeleteApplicationsAsync(
        List<Guid> applicationIds,
        string? userId,
        CancellationToken cancellationToken)
    {
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }
        
        var applications = await dbContext.Applications
            .Where(a => applicationIds.Contains(a.Id) && a.UserId == userId)
            .ToListAsync(cancellationToken);
        if (applications.Count == 0)
        {
            logger.LogWarning("No applications found for bulk delete with IDs: {ApplicationIds}", string.Join(", ", applicationIds));
            throw new NotFoundException("No applications found for the provided IDs.");
        }

        logger.LogInformation("Bulk deleting applications with IDs: {ApplicationIds}", string.Join(", ", applicationIds));
        dbContext.Applications.RemoveRange(applications);
        await dbContext.SaveChangesAsync(cancellationToken);
        cacheService.InvalidateUserApplicationCache(userId);
    }
}