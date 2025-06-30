import { create } from "zustand";
import { type ApplicationsRejectedState } from "#/applications";

export const useApplicationsRejectedCountStore =
  create<ApplicationsRejectedState>((set) => ({
    rejectedCount: 4,
    setRejectedCount: (item) => set({ rejectedCount: item }),
  }));
