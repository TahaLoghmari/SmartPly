import { request } from "@/api/client";
import type {
  ApplicationRequestDto,
  ApplicationResponseDto,
  ApplicationGetRequestDto,
  ApplicationQueryParametersDto,
  ApplicationPatchRequestDto,
  ApplicationEditRequestDto,
} from "#/applications";
import type { BulkDeleteRequestDto, PaginationResultDto } from "@/types";

export const createApplication = (credentials: ApplicationRequestDto) => {
  return request<ApplicationResponseDto>("/applications", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const editApplication = (credentials: ApplicationEditRequestDto) => {
  return request<void>(`/applications/${credentials.id}`, {
    method: "PUT",
    body: JSON.stringify(credentials.data),
  });
};

export const patchApplication = (credentials: ApplicationPatchRequestDto) => {
  return request<void>(`/applications/${credentials.id}`, {
    method: "PATCH",
    body: JSON.stringify(credentials.patch),
  });
};

export const deleteApplication = (id: string) => {
  return request<void>(`/applications/${id}`, {
    method: "DELETE",
  });
};

export const bulkdDeleteApplication = (credentials: BulkDeleteRequestDto) => {
  return request<void>(`/applications/bulk-delete`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const getUserApplications = (params: ApplicationQueryParametersDto) => {
  const queryObj: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryObj[key] = String(value);
    }
  });
  const query = new URLSearchParams(queryObj).toString();
  return request<PaginationResultDto<ApplicationResponseDto>>(
    `/applications?${query}`,
    {
      method: "GET",
    },
  ).then((result) => ({
    ...result,
    items: result.items.map((app) => ({
      ...app,
      createdAt: new Date(app.createdAt),
      updatedAt: app.updatedAt ? new Date(app.updatedAt) : undefined,
      deadline: app.deadline ? new Date(app.deadline) : undefined,
      wishListDate: app.wishListDate ? new Date(app.wishListDate) : undefined,
      appliedDate: app.appliedDate ? new Date(app.appliedDate) : undefined,
      interviewDate: app.interviewDate
        ? new Date(app.interviewDate)
        : undefined,
      offerDate: app.offerDate ? new Date(app.offerDate) : undefined,
      rejectedDate: app.rejectedDate ? new Date(app.rejectedDate) : undefined,
      ghostedDate: app.ghostedDate ? new Date(app.ghostedDate) : undefined,
    })),
  }));
};

export const getUserApplication = (credentials: ApplicationGetRequestDto) => {
  return request<ApplicationResponseDto>(`/applications/${credentials.id}`, {
    method: "GET",
  }).then((app) => ({
    ...app,
    createdAt: new Date(app.createdAt),
    updatedAt: app.updatedAt ? new Date(app.updatedAt) : undefined,
    deadline: app.deadline ? new Date(app.deadline) : undefined,
    wishListDate: app.wishListDate ? new Date(app.wishListDate) : undefined,
    appliedDate: app.appliedDate ? new Date(app.appliedDate) : undefined,
    interviewDate: app.interviewDate ? new Date(app.interviewDate) : undefined,
    offerDate: app.offerDate ? new Date(app.offerDate) : undefined,
    rejectedDate: app.rejectedDate ? new Date(app.rejectedDate) : undefined,
    ghostedDate: app.ghostedDate ? new Date(app.ghostedDate) : undefined,
  }));
};
