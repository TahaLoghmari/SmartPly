export interface ResumeCreateResponseDto {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  resumeUrl: string;
  size: number;
}

export interface CoverLetterCreateResponseDto {
  id: string;
  userId: string;
  name: string;
}

export interface CoverLetterStoreType {
  coverLettersState: CoverLetterCreateResponseDto[];
  setCoverLettersState: (resume: CoverLetterCreateResponseDto[]) => void;
}

export interface DocumentSearchBarStore {
  search: string;
  setSearch: (value: string) => void;
  clear: () => void;
}
