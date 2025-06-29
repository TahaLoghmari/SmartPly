import { create } from "zustand";
import { type NotificationsCount } from "..";

export const useNotificationsCount = create<NotificationsCount>((set) => ({
  notificationsCount: 3,
  setNotificationsCount: (count) => set({ notificationsCount: count }),
}));
