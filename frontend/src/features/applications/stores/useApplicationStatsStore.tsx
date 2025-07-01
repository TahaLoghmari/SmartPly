import { create } from "zustand";
import { type StatsState } from "#/applications";

export const useApplicationStatsStore = create<StatsState>((set) => ({
  wishListCount: 0,
  appliedCount: 0,
  interviewingCount: 0,
  offerCount: 0,
  rejectedCount: 0,
  ghostedCount: 0,
  setWishListCount: (count) => set({ wishListCount: count }),
  setAppliedCount: (count) => set({ appliedCount: count }),
  setInterviewingCount: (count) => set({ interviewingCount: count }),
  setOfferCount: (count) => set({ offerCount: count }),
  setRejectedCount: (count) => set({ rejectedCount: count }),
  setGhostedCount: (count) => set({ ghostedCount: count }),
}));
