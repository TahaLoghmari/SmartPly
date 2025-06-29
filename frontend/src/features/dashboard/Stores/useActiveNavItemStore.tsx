import { create } from "zustand";
import { type NavItemState } from "../../dashboard";

export const useActiveNavItemStore = create<NavItemState>((set) => ({
  activeNavItem: "applications",
  setActiveNavItem: (item) => set({ activeNavItem: item }),
}));
