import { create } from "zustand";
import { type DashboardGmailStoreType } from "#/dashboard";

export const useDashboardGmailStore = create<DashboardGmailStoreType>(
  (set) => ({
    gmailState: "Gmail Connected",
    setGmailState: (item) => set({ gmailState: item }),
  }),
);
