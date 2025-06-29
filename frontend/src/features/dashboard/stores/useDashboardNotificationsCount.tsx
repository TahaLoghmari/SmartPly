import { create } from "zustand";
import { type DashboardNotificationsCount } from "..";

export const useDashboardNotificationsCount =
  create<DashboardNotificationsCount>((set) => ({
    notificationsCount: 3,
    setNotificationsCount: (count) => set({ notificationsCount: count }),
  }));
