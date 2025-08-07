import type { Email, PaginatedEmailResponse } from "#/inbox";
import { request } from "@/index";

export const getUserEmails = (pageToken?: string | undefined) => {
  const url = pageToken
    ? `/emails?pageToken=${encodeURIComponent(pageToken)}`
    : "/emails";
  return request<PaginatedEmailResponse>(url, {
    method: "GET",
  });
};

export const getUserEmail = (id: string) => {
  return request<Email>(`/emails/${id}`, {
    method: "GET",
  });
};
