import { create } from "zustand";
import { type ApplicationsAppliedState } from "..";

export const useApplicationsAppliedCountStore =
  create<ApplicationsAppliedState>((set) => ({
    appliedCount: 8,
    setAppliedCount: (item) => set({ appliedCount: item }),
  }));
