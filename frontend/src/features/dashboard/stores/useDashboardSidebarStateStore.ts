import { create } from "zustand";
import { type DashboardSidebarStateStore } from "#/dashboard";

export const useDashboardSidebarStateStore = create<DashboardSidebarStateStore>(
  (set) => ({
    isSidebarOpen: true,
    setIsSidebarOpen: (state) => set({ isSidebarOpen: state }),
  }),
);
