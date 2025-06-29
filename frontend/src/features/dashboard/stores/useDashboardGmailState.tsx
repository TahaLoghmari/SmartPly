import { create } from "zustand";
import { type DashboardGmailState } from "..";

export const useDashboardGmailState = create<DashboardGmailState>((set) => ({
  gmailState: "Gmail Connected",
  setGmailState: (item) => set({ gmailState: item }),
}));
