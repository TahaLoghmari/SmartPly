import { type DashboardTitleStoreType } from "#/dashboard";
import { create } from "zustand";

export const useDashboardTitleStore = create<DashboardTitleStoreType>(
  (set) => ({
    dashboardTitleState: "",
    setDashboardTitleState: (state) => set({ dashboardTitleState: state }),
  }),
);
