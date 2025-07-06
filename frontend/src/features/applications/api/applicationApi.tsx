import { request } from "@/api/client";
import type {
  ApplicationCreateRequestDto,
  ApplicationResponseDto,
} from "#/applications";

export const applicationApi = {
  createApplication(credentials: ApplicationCreateRequestDto) {
    return request<ApplicationResponseDto>("/applications", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  getUserApplications() {
    return request<ApplicationResponseDto[]>("/applications", {
      method: "GET",
    }).then((apps) =>
      apps.map((app) => ({
        ...app,
        createdAt: new Date(app.createdAt),
        updatedAt: app.updatedAt ? new Date(app.updatedAt) : null,
        deadline: app.deadline ? new Date(app.deadline) : null,
      })),
    );
  },
};
