export interface CoverLetterResponseDto {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  url: string;
  size: number;
}

export interface CoverLetterRequestDto {
  name: string;
  file: File;
}
