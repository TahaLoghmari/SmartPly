export interface CoverLetterCreateResponseDto {
  id: string;
  userId: string;
  name: string;
}

export interface CoverLetterStoreType {
  coverLettersState: CoverLetterCreateResponseDto[];
  setCoverLettersState: (resume: CoverLetterCreateResponseDto[]) => void;
}
