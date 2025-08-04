export interface CoverLetterResponseDto {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  url: string;
  size: number;
}

export interface CoverLetterRequestDto {
  name: string;
  file: File;
}
