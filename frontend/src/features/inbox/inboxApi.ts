import type { EmailResponseDto, EmailQueryParameters, Message } from "#/inbox";
import { request, type PaginationResultDto } from "@/index";

export const getUserEmails = (params: EmailQueryParameters) => {
  const queryObj: Record<string, string> = {};
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryObj[key] = String(value);
    }
  });
  const query = new URLSearchParams(queryObj).toString();
  const url = query ? `/emails?${query}` : "/emails";
  return request<PaginationResultDto<EmailResponseDto>>(url, { method: "GET" });
};

export const getUserEmail = (id: string) => {
  return request<Message>(`/emails/${id}`, {
    method: "GET",
  });
};

export const syncUserEmails = () => {
  return request<void>("/emails/sync", {
    method: "POST",
  });
};
