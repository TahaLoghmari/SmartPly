export interface ResumeCreateResponseDto {
  id: string;
  userId: string;
  name: string;
  applicationsCount: number;
  interviewsCount: number;
}

export interface ResumeStoreType {
  resumesState: ResumeCreateResponseDto[];
  setResumesState: (resume: ResumeCreateResponseDto[]) => void;
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
