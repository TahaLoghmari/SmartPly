import type { PaginatedEmailResponse } from "#/inbox";
import { request } from "@/index";

export const getUserEmails = (pageToken?: string) => {
  const url = pageToken
    ? `/emails?pageToken=${encodeURIComponent(pageToken)}`
    : "/emails";
  return request<PaginatedEmailResponse>(url, {
    method: "GET",
  });
};
