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
