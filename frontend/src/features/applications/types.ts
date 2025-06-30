export interface ApplicationsWishListState {
  wishListCount: number;
  setWishListCount: (state: number) => void;
}

export interface ApplicationsAppliedState {
  appliedCount: number;
  setAppliedCount: (state: number) => void;
}

export interface ApplicationsInterviewingState {
  interviewingCount: number;
  setInterviewingCount: (state: number) => void;
}

export interface ApplicationsOfferState {
  offerCount: number;
  setOfferCount: (state: number) => void;
}

export interface ApplicationsRejectedState {
  rejectedCount: number;
  setRejectedCount: (state: number) => void;
}

export interface ApplicationsGhostedState {
  ghostedCount: number;
  setGhostedCount: (state: number) => void;
}

export interface ApplicationsStatusFilterState {
  isStatusFilterOpen: boolean;
  selectedStatusFilter: string;
  setIsStatusFilterOpen: (open: boolean) => void;
  setSelectedFilterStatus: (status: string) => void;
  clearStatusFilter: () => void;
}

export interface ApplicationsTypeFilterState {
  isTypeFilterOpen: boolean;
  selectedTypeFilter: string;
  setIsTypeFilterOpen: (open: boolean) => void;
  setSelectedFilterType: (type: string) => void;
  clearTypeFilter: () => void;
}

export interface ApplicationsLevelFilterState {
  isLevelFilterOpen: boolean;
  selectedLevelFilter: string;
  setIsLevelFilterOpen: (open: boolean) => void;
  setSelectedFilterLevel: (level: string) => void;
  clearLevelFilter: () => void;
}

export interface ApplicationsJobTypeFilterState {
  isJobTypeFilterOpen: boolean;
  selectedJobTypeFilter: string;
  setIsJobTypeFilterOpen: (open: boolean) => void;
  setSelectedFilterJobType: (jobType: string) => void;
  clearJobTypeFilter: () => void;
}

export interface ApplicationCard {
  id: string;
  companyName: string;
  companyEmail: string;
  companyIcon: string;
  position: string;
  link: string;
  status: string;
  notes: string;
  location: string;
  salary: string;
  frameworksOrLanguagesUsed: string;
  contacts: string;
  deadline: string;
  jobDescription: string;
  resumeUsed: string;
  coverLetterUsed: string;
  type: string;
  employmentType: string;
  level: string;
}

export interface ApplicationCardState {
  applicationCard: ApplicationCard | null;
  setApplicationCard: (card: ApplicationCard) => void;
}
