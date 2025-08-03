import { request } from "@/client";
import type {
  ResumeResponseDto,
  ResumeRequestDto,
  ResumeGetRequestDto,
} from "#/documents";
import type { BulkDeleteRequestDto } from "@/types";

export const getUserResumes = (search?: string) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);

  const query = params.toString();
  const url = query ? `/resumes?${query}` : "/resumes";

  return request<ResumeResponseDto[]>(url, {
    method: "GET",
  }).then((resumes) =>
    resumes.map((resume) => ({
      ...resume,
      createdAt: new Date(resume.createdAt),
      updatedAt: resume.updatedAt ? new Date(resume.updatedAt) : null,
      size: +(resume.size / (1024 * 1024)).toFixed(2),
    })),
  );
};

export const getUserResume = (credentials: ResumeGetRequestDto) => {
  return request<ResumeResponseDto>(`/resumes/${credentials.id}`, {
    method: "GET",
  });
};

export const uploadResume = (credentials: ResumeRequestDto) => {
  const formData = new FormData();
  formData.append("name", credentials.name);
  formData.append("file", credentials.file);
  return request<ResumeResponseDto>("/resumes", {
    method: "POST",
    body: formData,
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
