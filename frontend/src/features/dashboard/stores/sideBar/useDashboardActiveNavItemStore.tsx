import { create } from "zustand";
import { type DashboardActiveNavItemStoreType } from "#/dashboard";

export const useDashboardActiveNavItemStore =
  create<DashboardActiveNavItemStoreType>((set) => ({
    activeNavItemState: "applications",
    setActiveNavItemState: (item) => set({ activeNavItemState: item }),
  }));
