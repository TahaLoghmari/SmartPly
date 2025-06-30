import { create } from "zustand";
import { type ApplicationsTypeFilterState } from "../types";

export const useApplicationsTypeFilterStore =
  create<ApplicationsTypeFilterState>((set) => ({
    isTypeFilterOpen: false,
    selectedTypeFilter: "All Types",

    setIsTypeFilterOpen: (open) => set({ isTypeFilterOpen: open }),

    setSelectedFilterType: (type) => set({ selectedTypeFilter: type }),

    clearTypeFilter: () => set({ selectedTypeFilter: "All Types" }),
  }));
