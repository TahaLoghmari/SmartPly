using backend.DTOs;
using backend.Entities;
using backend.Exceptions;
using backend.Hubs;
using backend.Mappings;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace backend.Services;

public class NotificationService(
    IHubContext<NotificationHub> hubContext,
    ApplicationDbContext dbContext,
    ILogger<NotificationService> logger,
    IMemoryCache cache,
    CacheService cacheService)
{
    public async Task<PaginationResultDto<NotificationResponseDto>> GetNotificationsAsync(
        string? userId,
        NotificationQueryParameters query,
        CancellationToken cancellationToken)
    {
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }

        logger.LogInformation("Retrieving notifications for user with ID {UserId}", userId); 

        IQueryable<NotificationResponseDto> notificationQuery = dbContext.Notifications
            .AsNoTracking()
            .Where(a => a.UserId == userId)
            .OrderBy(a => a.CreatedAt)
            .Select(a => a.ToNotificationResponseDto());
        
        var paginationResult = await PaginationResultDto<NotificationResponseDto>.CreateAsync(
            notificationQuery, query.Page ?? 1, query.PageSize ?? 8,cancellationToken);
        
        return paginationResult;
    }

    public async Task MarkNotificationAsReadAsync(
        Guid id,
        string? userId,
        CancellationToken cancellationToken)
    {
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }
        
        var notification = await dbContext.Notifications
            .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId, cancellationToken);

        if (notification is null)
        {
            logger.LogWarning("Notification not found for Id: {NotificationId}", id);
            throw new NotFoundException($"Notification with ID '{id}' not found.");
        }

        if (!notification.IsRead)
        {
            notification.IsRead = true;
            await dbContext.SaveChangesAsync(cancellationToken);
            logger.LogInformation("Notification {NotificationId} marked as read", id);
        }
        
        logger.LogInformation("Notifications Cache invalidated for user ID: {UserId}", userId);
    }

    public async Task MarkNotificationsAsReadAsync(
        string? userId,
        CancellationToken cancellationToken)
    {
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }
        
        var notifications = await dbContext.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync(cancellationToken);

        if (notifications.Count == 0)
        {
            logger.LogWarning("No notifications found to mark as read for user ID: {UserId}", userId);
            throw new NotFoundException("No notifications found for the provided userId.");
        }

        foreach (var notification in notifications)
            notification.IsRead = true;

        await dbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Marked {UnreadNotificationsCount} notifications as read for user ID: {UserId}", notifications.Count, userId);

        logger.LogInformation("Notifications Cache invalidated for user ID: {UserId}", userId);
    }
    
    public async Task AddNotificationAsync(
        string? userId,
        NotificationRequestDto notificationRequestDto,
        CancellationToken cancellationToken)
    {
        if (userId is null)
        {
            logger.LogWarning("Get current user failed - user ID claim missing");
            throw new UnauthorizedException("User ID claim is missing.");
        }
        
        Notification notification = notificationRequestDto.ToNotification(userId);
        
        dbContext.Notifications.Add(notification);
        
        await dbContext.SaveChangesAsync(cancellationToken);
        
        logger.LogInformation("Notification created with ID {NotificationId}", notification.Id);

        await SendToUser(userId,notification.ToNotificationResponseDto());
    }
    
    private async Task SendToUser(string userId, NotificationResponseDto notificationDto)
    {
        await hubContext.Clients.User(userId).SendAsync("NotificationReceived", notificationDto);
    }
}
