import type { ResumeRequestDto, ResumeResponseDto } from "#/resumes";
import type {
  CoverLetterRequestDto,
  CoverLetterResponseDto,
} from "#/coverLetters";

export const mapDocumentDates = (
  document: ResumeResponseDto | CoverLetterResponseDto,
) => ({
  ...document,
  createdAt: new Date(document.createdAt),
  updatedAt: document.updatedAt ? new Date(document.updatedAt) : undefined,
  size: +(document.size / (1024 * 1024)).toFixed(2),
});

export function generateUserDocumentsUrl(
  documentType: string,
  search?: string,
) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);

  const query = params.toString();
  const url = query ? `/${documentType}?${query}` : `/${documentType}`;

  return url;
}

export function generateUploadDocumentData(
  credentials: ResumeRequestDto | CoverLetterRequestDto,
) {
  const formData = new FormData();
  formData.append("name", credentials.name);
  formData.append("file", credentials.file);

  return formData;
}
