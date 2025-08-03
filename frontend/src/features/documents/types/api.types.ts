export interface ResumeResponseDto {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  resumeUrl: string;
  size: number;
}

export interface ResumeRequestDto {
  name: string;
  file: File;
}

export interface ResumeGetRequestDto {
  id: string;
}

export interface CoverLetterCreateResponseDto {
  id: string;
  userId: string;
  name: string;
}
