import { create } from "zustand";
import { type DashboardSideBarState } from "..";

export const useDashboardSideBarState = create<DashboardSideBarState>(
  (set) => ({
    activeState: true,
    setActiveState: (state) => set({ activeState: state }),
  }),
);
