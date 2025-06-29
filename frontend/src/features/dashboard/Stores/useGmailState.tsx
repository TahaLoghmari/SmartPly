import { create } from "zustand";
import { type GmailState } from "..";

export const useGmailState = create<GmailState>((set) => ({
  gmailState: "Gmail Connected",
  setGmailState: (item) => set({ gmailState: item }),
}));
