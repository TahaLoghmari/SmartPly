import type { Email } from "#/inbox";
import { request } from "@/index";

export const getUserEmails = () => {
  return request<Email>("/emails", {
    method: "GET",
  });
};
