import { create } from "zustand";
import { type NavItemState } from "../../dashboard";

export const useActiveNavItemStore = create<NavItemState>((set) => ({
  activeNavItem: "dashboard",
  setActiveNavItem: (item) => set({ activeNavItem: item }),
}));
