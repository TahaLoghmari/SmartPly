import { create } from "zustand";
import { type ApplicationsOfferState } from "..";

export const useApplicationsOfferCountStore = create<ApplicationsOfferState>(
  (set) => ({
    offerCount: 1,
    setOfferCount: (item) => set({ offerCount: item }),
  }),
);
