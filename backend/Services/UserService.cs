using backend.DTOs;
using backend.Entities;
using backend.Exceptions;
using backend.Mappings;
using Hangfire;
using Hangfire.Storage;
using Microsoft.AspNetCore.Identity;

namespace backend.Services;

public class UserService(
    UserManager<User> userManager,
    ILogger<UserService> logger,
    IRecurringJobManager recurringJobManager,
    CookieService cookieService,
    ApplicationDbContext dbContext)
{
    public async Task<UserDto> GetCurrentUser(
        string? userId)
    {
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.", "Unauthorized");
        }

        var user = await userManager.FindByIdAsync(userId);

        if (user is null)
        {
            logger.LogWarning("Get current user failed - user not found for UserId: {UserId}", userId);
            throw new NotFoundException($"No user found with ID '{userId}'.", "User not found");
        }
        
        logger.LogInformation("Current user retrieved successfully for UserId: {UserId}", userId);
        
        UserDto userDto = user.toUserDto();

        return userDto;
    }
    
    public async Task DeleteCurrentUserAsync(
        string? userId,
        HttpContext httpContext)
    {
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }

        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            logger.LogWarning("Get current user failed - user ID not found");
            throw new UnauthorizedException("User not found.");
        }

        logger.LogInformation("Deleting user with UserId: {UserId}", userId);
        await userManager.DeleteAsync(user);
        logger.LogInformation("User deleted successfully. UserId: {UserId}", userId);
        
        var recurringJobs = JobStorage.Current.GetConnection().GetRecurringJobs();
        foreach (var job in recurringJobs.Where(j => j.Id.StartsWith($"user-{userId}-")))
        {
            recurringJobManager.RemoveIfExists(job.Id);
        }
        logger.LogInformation("Removed all recurring jobs for UserId: {UserId}", userId);
        using (var connection = JobStorage.Current.GetConnection())
        {
            var monitoringApi = JobStorage.Current.GetMonitoringApi();
            
            var scheduled = monitoringApi.ScheduledJobs(0, int.MaxValue);
            foreach (var kvp in scheduled)
            {
                var jobId = kvp.Key;
                var job = kvp.Value;

                if (job.Job.Args.Contains(userId))
                {
                    BackgroundJob.Delete(jobId);
                }
            }
            logger.LogInformation("Deleted all scheduled jobs for UserId: {UserId}", userId);

            var queues = monitoringApi.Queues();
            foreach (var queue in queues)
            {
                var enqueued = monitoringApi.EnqueuedJobs(queue.Name, 0, int.MaxValue);
                foreach (var kvp in enqueued)
                {
                    var jobId = kvp.Key;
                    var job = kvp.Value;

                    if (job.Job.Args.Contains(userId))
                    {
                        BackgroundJob.Delete(jobId);
                    }
                }
            }
            logger.LogInformation("Deleted all queued jobs for UserId: {UserId}", userId);
        }

        
        logger.LogInformation("Removed all jobs for UserId: {UserId}", userId);
        
        cookieService.RemoveCookies(httpContext.Response);
        
        logger.LogInformation("Removed cookies for UserId: {UserId}", userId);
    }

    public async Task UpdateCurrentUserAsync(
        UserRequestDto dto,
        string? userId)
    {
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }

        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            logger.LogWarning("Get current user failed - user ID not found");
            throw new UnauthorizedException("User not found.");
        }
        
        await using var transaction = await dbContext.Database.BeginTransactionAsync();

        try
        {
            logger.LogInformation("Updating user profile for UserId: {UserId}", userId);

            if (!string.IsNullOrEmpty(dto.Name)) user.Name = dto.Name;
            await userManager.UpdateAsync(user);

            if (!string.IsNullOrEmpty(dto.CurrentPassword) && !string.IsNullOrEmpty(dto.Password))
            {
                logger.LogInformation("Attempting password change for UserId: {UserId}", userId);
                var result = await userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.Password);
                if (!result.Succeeded)
                {
                    logger.LogWarning("Password change failed for UserId: {UserId}. Errors: {Errors}",
                        userId, string.Join(", ", result.Errors.Select(e => $"{e.Code}: {e.Description}")));
                    throw new BadRequestException("Password change failed.", "Password change failed", result.Errors);
                }
                logger.LogInformation("Password changed successfully for UserId: {UserId}", userId);
            }

            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            logger.LogWarning("Failed to update user profile for UserId: {UserId}", userId);
            throw;
        }
    }
}