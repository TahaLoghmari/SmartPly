import type { NotificationType } from "#/notifications";

export type NotificationQueryParameters = {
  page: number;
  pageSize: number;
};

export type NotificationResponseDto = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  type: NotificationType;
};

export type NotificationRequestDto = {
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
};
