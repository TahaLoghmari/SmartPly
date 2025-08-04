import { create } from "zustand";
import { type SelectedCoverLettersStore } from "#/coverLetters";

export const useSelectedCoverLettersStore = create<
  SelectedCoverLettersStore<any>
>()((set) => ({
  selected: [],
  setSelected: (rows) => set({ selected: rows }),
  clearSelected: () => set({ selected: [] }),
}));
