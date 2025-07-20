import { create } from "zustand";
import { type DialogStore } from "@/types";

export const useDialogStore = create<DialogStore>((set) => ({
  openDialog: false,
  setOpenDialog: (open) => set({ openDialog: open }),
}));
