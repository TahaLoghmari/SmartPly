import { request } from "@/api/client";
import type {
  ApplicationRequestDto,
  ApplicationResponseDto,
  ApplicationGetRequestDto,
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

export const patchApplication = (id: string, patch: unknown) => {
  return request<void>(`/applications/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
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
      wishListDate: app.wishListDate ? new Date(app.wishListDate) : null,
      appliedDate: app.appliedDate ? new Date(app.appliedDate) : null,
      interviewDate: app.interviewDate ? new Date(app.interviewDate) : null,
      offerDate: app.offerDate ? new Date(app.offerDate) : null,
      rejectedDate: app.rejectedDate ? new Date(app.rejectedDate) : null,
      ghostedDate: app.ghostedDate ? new Date(app.ghostedDate) : null,
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
    wishListDate: app.wishListDate ? new Date(app.wishListDate) : null,
    appliedDate: app.appliedDate ? new Date(app.appliedDate) : null,
    interviewDate: app.interviewDate ? new Date(app.interviewDate) : null,
    offerDate: app.offerDate ? new Date(app.offerDate) : null,
    rejectedDate: app.rejectedDate ? new Date(app.rejectedDate) : null,
    ghostedDate: app.ghostedDate ? new Date(app.ghostedDate) : null,
  }));
};
