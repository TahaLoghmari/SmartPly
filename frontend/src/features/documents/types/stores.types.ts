import type { CoverLetterCreateResponseDto } from "#/documents";

export interface CoverLetterStoreType {
  coverLettersState: CoverLetterCreateResponseDto[];
  setCoverLettersState: (resume: CoverLetterCreateResponseDto[]) => void;
}

export interface DocumentSearchBarStore {
  search: string;
  setSearch: (value: string) => void;
  clear: () => void;
}
