using backend.Enums;

namespace backend.Utilities;

public static class NotificationUtilities
{
    public static NotificationType MapCategoryToNotificationType(string? category)
    {
        if (string.IsNullOrWhiteSpace(category))
            return NotificationType.otherUpdate;

        switch (category.Trim().ToLowerInvariant())
        {
            case "interview":
                return NotificationType.interview;
            case "offer":
                return NotificationType.offer;
            case "applied":
                return NotificationType.applied;
            case "rejected":
                return NotificationType.rejected;
            case "emailUpdate":
                return NotificationType.emailUpdate;
            default:
                return NotificationType.otherUpdate;
        }
    }
}