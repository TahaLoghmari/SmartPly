export interface ResumeCreateResponseDto {
  id: string;
  // userId: string;
  name: string;
  applicationsCount: number;
  interviewsCount: number;
}

export interface ResumeStoreType {
  resumesState: ResumeCreateResponseDto[];
  setResumesState: (resume: ResumeCreateResponseDto[]) => void;
}
