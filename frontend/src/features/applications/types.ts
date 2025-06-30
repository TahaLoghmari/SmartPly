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
