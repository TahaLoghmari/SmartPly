import { request } from "@/client";
import {
  mapDocumentDates,
  generateUserDocumentsUrl,
  generateUploadDocumentData,
} from "#/documents";
import type { BulkDeleteRequestDto } from "@/types";
import {
  type CoverLetterResponseDto,
  type CoverLetterRequestDto,
} from "#/coverLetters";

export const getUserCoverLetters = (search?: string) => {
  return request<CoverLetterResponseDto[]>(
    generateUserDocumentsUrl("cover-letters", search),
    {
      method: "GET",
    },
  ).then((coverLetters) => coverLetters.map(mapDocumentDates));
};

export const getUserCoverLetter = (id: string) => {
  return request<CoverLetterResponseDto>(`/cover-letters/${id}`, {
    method: "GET",
  });
};

export const uploadCoverLetter = (credentials: CoverLetterRequestDto) => {
  return request<CoverLetterResponseDto>("/cover-letters", {
    method: "POST",
    body: generateUploadDocumentData(credentials),
  });
};

export const deleteCoverLetter = (id: string) => {
  return request<void>(`/cover-letters/${id}`, {
    method: "DELETE",
  });
};

export const bulkDeleteCoverLetters = (credentials: BulkDeleteRequestDto) => {
  return request<void>(`/cover-letters/bulk-delete`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};
