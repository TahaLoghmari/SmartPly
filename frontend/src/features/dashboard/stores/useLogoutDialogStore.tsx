import { create } from "zustand";
import { type LogoutDialogStoreType } from "#/dashboard";

export const useLogoutDialogStore = create<LogoutDialogStoreType>((set) => ({
  isOpen: false,
  setIsOpen: (state) => set({ isOpen: state }),
}));
