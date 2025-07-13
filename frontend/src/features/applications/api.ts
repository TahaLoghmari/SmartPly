import { request } from "@/api/client";
import type {
  ApplicationRequestDto,
  ApplicationResponseDto,
  ApplicationGetRequestDto,
} from "#/applications";

export const createApplication = (credentials: ApplicationRequestDto) => {
  return request<ApplicationResponseDto>("/applications", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const editApplication = (
  id: string,
  credentials: ApplicationRequestDto,
) => {
  return request<void>(`/applications/${id}`, {
    method: "PUT",
    body: JSON.stringify(credentials),
  });
};

export const getUserApplications = (params: {
  status?: string;
  type?: string;
  level?: string;
  jobType?: string;
  search?: string;
}) => {
  const query = new URLSearchParams(
    params as Record<string, string>,
  ).toString();
  return request<ApplicationResponseDto[]>(`/applications?${query}`, {
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
