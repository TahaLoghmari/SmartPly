import { create } from "zustand";
import { type DashboardNotificationsCountStore } from "#/dashboard";

export const useDashboardNotificationsCountStore =
  create<DashboardNotificationsCountStore>((set) => ({
    notificationsCountState: 0,
    setNotificationsCountState: (count) =>
      set({ notificationsCountState: count }),
  }));
