export interface ResumeResponseDto {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  url: string;
  size: number;
}

export interface CoverLetterResponseDto {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  Url: string;
  size: number;
}

export interface ResumeRequestDto {
  name: string;
  file: File;
}

export interface ResumeGetRequestDto {
  id: string;
}
