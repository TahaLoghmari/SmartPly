import { create } from "zustand";
import { type AddApplicationDialogStore } from "#/dashboard";

export const useAddApplicationDialogStore = create<AddApplicationDialogStore>(
  (set) => ({
    addApplicationOpen: false,
    setAddApplicationOpen: (open) => set({ addApplicationOpen: open }),
  }),
);
