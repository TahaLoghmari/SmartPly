import { request } from "@/api/client";
import type {
  ApplicationRequestDto,
  ApplicationResponseDto,
  ApplicationGetRequestDto,
  ApplicationStatsDto,
  PaginationResult,
  ApplicationQueryParameters,
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

export const deleteApplication = (id: string) => {
  return request<void>(`/applications/${id}`, {
    method: "DELETE",
  });
};

export const getUserApplications = (params: ApplicationQueryParameters) => {
  const queryObj: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryObj[key] = String(value);
    }
  });
  const query = new URLSearchParams(queryObj).toString();
  return request<PaginationResult>(`/applications?${query}`, {
    method: "GET",
  }).then((result) => ({
    ...result,
    items: result.items.map((app) => ({
      ...app,
      createdAt: new Date(app.createdAt),
      updatedAt: app.updatedAt ? new Date(app.updatedAt) : null,
      deadline: app.deadline ? new Date(app.deadline) : null,
    })),
  }));
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

export const getApplicationStats = () => {
  return request<ApplicationStatsDto>(`/applications/stats`, {
    method: "GET",
  });
};
