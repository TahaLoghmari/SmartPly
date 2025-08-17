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
    CookieService cookieService)
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
        
        logger.LogInformation("Updating user profile for UserId: {UserId}", userId);
        user.Name = dto.Name;
        await userManager.UpdateAsync(user);

        logger.LogInformation("Attempting password change for UserId: {UserId}", userId);
        var result = await userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
        if (!result.Succeeded)
        {
            logger.LogWarning("Password change failed for UserId: {UserId}. Errors: {Errors}",
                userId, string.Join(", ", result.Errors.Select(e => $"{e.Code}: {e.Description}")));
            throw new BadRequestException("Password change failed.", "Password change failed", result.Errors);
        }
        logger.LogInformation("Password changed successfully for UserId: {UserId}", userId);
    }
}