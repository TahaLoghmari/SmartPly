import { create } from "zustand";
import { type DashboardInboxTypeStore } from "#/dashboard";

export const useDashboardInboxTypeStore = create<DashboardInboxTypeStore>(
  (set) => ({
    inboxType: "Inbox",
    setInboxType: (type) => set({ inboxType: type }),
  }),
);
