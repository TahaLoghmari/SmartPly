import { create } from "zustand";
import { type ApplicationCardState } from "..";

export const useApplicationsCardStore = create<ApplicationCardState>((set) => ({
  applicationCard: null,
  setApplicationCard: (card) => set({ applicationCard: card }),
}));
