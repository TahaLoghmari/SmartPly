import { create } from "zustand";
import { type ApplicationsLevelFilterState } from "../types";

export const useApplicationsLevelFilterStore =
  create<ApplicationsLevelFilterState>((set) => ({
    isLevelFilterOpen: false,
    selectedLevelFilter: "All Levels",

    setIsLevelFilterOpen: (open) => set({ isLevelFilterOpen: open }),

    setSelectedFilterLevel: (level) => set({ selectedLevelFilter: level }),

    clearLevelFilter: () => set({ selectedLevelFilter: "All Levels" }),
  }));
