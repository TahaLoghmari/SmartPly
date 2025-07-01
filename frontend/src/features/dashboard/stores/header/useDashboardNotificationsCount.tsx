import { create } from "zustand";
import { type DashboardNotificationsCountStoreType } from "#/dashboard";

export const useDashboardNotificationsCountStore =
  create<DashboardNotificationsCountStoreType>((set) => ({
    notificationsCountState: 3,
    setNotificationsCountState: (count) =>
      set({ notificationsCountState: count }),
  }));
