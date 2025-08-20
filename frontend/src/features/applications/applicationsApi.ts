import { request } from "@/client";
import {
  type ApplicationRequestDto,
  type ApplicationResponseDto,
  type ApplicationGetRequestDto,
  type ApplicationQueryParametersDto,
  type ApplicationPatchRequestDto,
  type ApplicationEditRequestDto,
  mapApplicationDates,
} from "#/applications";
import type {
  BulkDeleteRequestDto,
  PaginationResultDto,
} from "@/types/api.types";

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
    items: result.items.map(mapApplicationDates),
  }));
};

export const getUserApplication = (credentials: ApplicationGetRequestDto) => {
  return request<ApplicationResponseDto>(`/applications/${credentials.id}`, {
    method: "GET",
  }).then(mapApplicationDates);
};
