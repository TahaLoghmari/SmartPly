export interface ResumeResponseDto {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  url: string;
  size: number;
}

export interface ResumeRequestDto {
  name: string;
  file: File;
}
