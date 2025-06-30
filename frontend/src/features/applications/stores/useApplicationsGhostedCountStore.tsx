import { create } from "zustand";
import { type ApplicationsGhostedState } from "..";

export const useApplicationsGhostedCountStore =
  create<ApplicationsGhostedState>((set) => ({
    ghostedCount: 2,
    setGhostedCount: (item) => set({ ghostedCount: item }),
  }));
