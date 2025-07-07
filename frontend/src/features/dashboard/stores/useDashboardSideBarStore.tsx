import { create } from "zustand";
import { type DashboardSideBarStoreType } from "#/dashboard";

export const useDashboardSideBarStore = create<DashboardSideBarStoreType>(
  (set) => ({
    activeState: true,
    setActiveState: (state) => set({ activeState: state }),
  }),
);
