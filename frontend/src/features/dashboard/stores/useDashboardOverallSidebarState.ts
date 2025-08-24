import { create } from "zustand";
import { type DashboardOverallSidebarState } from "#/dashboard";

export const useDashboardOverallSidebarState =
  create<DashboardOverallSidebarState>((set) => ({
    isOverallSidebarOpen: true,
    setIsOverallSidebarOpen: (state) => set({ isOverallSidebarOpen: state }),
  }));
