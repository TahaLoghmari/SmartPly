import { request } from "@/api/client";
import type {
  ApplicationCreateRequestDto,
  ApplicationResponseDto,
  ApplicationGetRequestDto,
} from "#/applications";

export const createApplication = (credentials: ApplicationCreateRequestDto) => {
  return request<ApplicationResponseDto>("/applications", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const getUserApplications = () => {
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
};

export const getUserApplication = (credentials: ApplicationGetRequestDto) => {
  return request<ApplicationResponseDto>(`/applications/${credentials.id}`, {
    method: "GET",
  }).then((app) => ({
    ...app,
    createdAt: new Date(app.createdAt),
    updatedAt: app.updatedAt ? new Date(app.updatedAt) : null,
    deadline: app.deadline ? new Date(app.deadline) : null,
  }));
};
