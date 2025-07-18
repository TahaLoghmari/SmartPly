import { request } from "@/api/client";
import type { ResumeCreateResponseDto } from "#/documents";

export const getUserResumes = (search?: string) => {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return request<ResumeCreateResponseDto[]>(`/resumes?${query}`, {
    method: "GET",
  }).then((resumes) =>
    resumes.map((resume) => ({
      ...resume,
      createdAt: new Date(resume.createdAt),
      updatedAt: resume.updatedAt ? new Date(resume.updatedAt) : null,
    })),
  );
};
