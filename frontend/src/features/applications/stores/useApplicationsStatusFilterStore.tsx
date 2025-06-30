import { create } from "zustand";
import { type ApplicationsStatusFilterState } from "../types";

export const useApplicationsStatusFilterStore =
  create<ApplicationsStatusFilterState>((set) => ({
    isStatusFilterOpen: false,
    selectedStatusFilter: "All Status",

    setIsStatusFilterOpen: (open) => set({ isStatusFilterOpen: open }),

    setSelectedFilterStatus: (status) => set({ selectedStatusFilter: status }),

    clearStatusFilter: () => set({ selectedStatusFilter: "All Status" }),
  }));
