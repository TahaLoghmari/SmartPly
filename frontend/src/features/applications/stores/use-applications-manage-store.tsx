import { create } from "zustand";
import { type ManageApplicationStore } from "#/applications";

export const useManageApplicationStore = create<ManageApplicationStore>(
  (set) => ({
    openDialog: false,
    setOpenDialog: (open) => set({ openDialog: open }),
  }),
);
