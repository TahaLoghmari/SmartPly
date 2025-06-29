import { create } from "zustand";
import { type DashboardNavItemState } from "..";

export const useDashboardActiveNavItemStore = create<DashboardNavItemState>(
  (set) => ({
    activeNavItem: "applications",
    setActiveNavItem: (item) => set({ activeNavItem: item }),
  }),
);
