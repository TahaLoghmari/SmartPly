import { create } from "zustand";
import { type LogoutDialogStore } from "#/dashboard";

export const useLogoutDialogStore = create<LogoutDialogStore>((set) => ({
  isOpen: false,
  setIsOpen: (state) => set({ isOpen: state }),
}));
