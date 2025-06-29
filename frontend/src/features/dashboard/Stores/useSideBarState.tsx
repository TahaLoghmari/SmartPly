import { create } from "zustand";
import { type SideBarState } from "..";

export const useSideBarState = create<SideBarState>((set) => ({
  activeState: true,
  setActiveState: (state) => set({ activeState: state }),
}));
