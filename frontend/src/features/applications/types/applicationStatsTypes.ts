export interface StatsState {
  wishListCount: number;
  appliedCount: number;
  interviewingCount: number;
  offerCount: number;
  rejectedCount: number;
  ghostedCount: number;
  setWishListCount: (count: number) => void;
  setAppliedCount: (count: number) => void;
  setInterviewingCount: (count: number) => void;
  setOfferCount: (count: number) => void;
  setRejectedCount: (count: number) => void;
  setGhostedCount: (count: number) => void;
}

export interface ApplicationStatCardProps {
  value: number;
  label: string;
}
