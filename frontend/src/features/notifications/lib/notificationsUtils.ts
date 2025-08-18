import type { NotificationResponseDto } from "#/notifications";

export const mapNotificationDates = (
  notification: NotificationResponseDto,
) => ({
  ...notification,
  createdAt: new Date(notification.createdAt),
});
