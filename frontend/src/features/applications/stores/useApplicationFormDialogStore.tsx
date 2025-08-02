import { create } from "zustand";
import { type ApplicationFormDialogStore } from "#/applications";

export const useApplicationFormDialogStore = create<ApplicationFormDialogStore>(
  (set) => ({
    openDialog: false,
    setOpenDialog: (open) => set({ openDialog: open }),
  }),
);
