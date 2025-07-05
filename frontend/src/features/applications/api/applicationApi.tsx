import { request } from "@/api/client";
import type { ApplicationCreateRequestDto } from "#/applications";

export const applicationApi = {
  createApplication(credentials: ApplicationCreateRequestDto) {
    return request<string>("/applications", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
};
