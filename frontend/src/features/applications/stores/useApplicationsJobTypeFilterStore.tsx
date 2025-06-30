import { create } from "zustand";
import { type ApplicationsJobTypeFilterState } from "../types";

export const useApplicationsJobTypeFilterStore =
  create<ApplicationsJobTypeFilterState>((set) => ({
    isJobTypeFilterOpen: false,
    selectedJobTypeFilter: "All Job Types",

    setIsJobTypeFilterOpen: (open) => set({ isJobTypeFilterOpen: open }),

    setSelectedFilterJobType: (jobType) =>
      set({ selectedJobTypeFilter: jobType }),

    clearJobTypeFilter: () => set({ selectedJobTypeFilter: "All Job Types" }),
  }));
