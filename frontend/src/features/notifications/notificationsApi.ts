import {
  mapNotificationDates,
  type NotificationQueryParameters,
  type NotificationResponseDto,
} from "#/notifications";
import { request, type PaginationResultDto } from "@/index";

export const getNotifications = (params: NotificationQueryParameters) => {
  const queryObj: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryObj[key] = String(value);
    }
  });
  const query = new URLSearchParams(queryObj).toString();
  return request<PaginationResultDto<NotificationResponseDto>>(
    `/notifications?${query}`,
    {
      method: "GET",
    },
  ).then((result) => ({
    ...result,
    items: result.items.map(mapNotificationDates),
  }));
};
