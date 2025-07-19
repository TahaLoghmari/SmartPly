import { request } from "@/api/client";
import type { ResumeCreateResponseDto } from "#/documents";

export const getUserResumes = (search?: string) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);

  const query = params.toString();
  const url = query ? `/resumes?${query}` : "/resumes";

  return request<ResumeCreateResponseDto[]>(url, {
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

export const deleteResume = (id: string) => {
  return request<void>(`/resumes/${id}`, {
    method: "DELETE",
  });
};
