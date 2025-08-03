import { request } from "@/client";
import {
  mapDocumentDates,
  generateUserDocumentsUrl,
  generateUploadDocumentData,
} from "#/documents";
import { type ResumeRequestDto, type ResumeResponseDto } from "#/resumes";
import type { BulkDeleteRequestDto } from "@/types";

export const getUserResumes = (search?: string) => {
  return request<ResumeResponseDto[]>(
    generateUserDocumentsUrl("resumes", search),
    {
      method: "GET",
    },
  ).then((resumes) => resumes.map(mapDocumentDates));
};

export const getUserResume = (id: string) => {
  return request<ResumeResponseDto>(`/resumes/${id}`, {
    method: "GET",
  });
};

export const uploadResume = (credentials: ResumeRequestDto) => {
  return request<ResumeResponseDto>("/resumes", {
    method: "POST",
    body: generateUploadDocumentData(credentials),
  });
};

export const deleteResume = (id: string) => {
  return request<void>(`/resumes/${id}`, {
    method: "DELETE",
  });
};

export const bulkDeleteResumes = (credentials: BulkDeleteRequestDto) => {
  return request<void>(`/resumes/bulk-delete`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};
