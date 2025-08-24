import { create } from "zustand";
import { type DashboardInboxStateStore } from "#/dashboard";

export const useDashboardInboxStateStore = create<DashboardInboxStateStore>(
  (set) => ({
    isInboxOpen: true,
    setIsInboxOpen: (state) => set({ isInboxOpen: state }),
  }),
);
