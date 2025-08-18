using backend.DTOs;
using backend.Entities;

namespace backend.Mappings;

public static class NotificationMappings
{
    public static NotificationResponseDto ToNotificationResponseDto(this Notification notification)
    {
        return new NotificationResponseDto
        {
            Id = notification.Id,
            Title = notification.Title,
            Message = notification.Message,
            IsRead = notification.IsRead,
            CreatedAt = notification.CreatedAt,
            Type = notification.Type
        };
    }
    public static Notification ToNotification(this NotificationRequestDto request, string userId)
    {
        return new Notification
        {
            UserId = userId,
            Title = request.Title,
            Message = request.Message,
            IsRead = request.IsRead,
            CreatedAt = request.CreatedAt,
            Type = request.Type,
        };
    }
}