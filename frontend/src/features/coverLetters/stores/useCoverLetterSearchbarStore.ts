import { type CoverLetterSearchbarStore } from "#/coverLetters";
import { create } from "zustand";

export const useCoverLetterSearchbarStore = create<CoverLetterSearchbarStore>(
  (set) => ({
    search: "",
    setSearch: (value) => set({ search: value }),
    clear: () => set({ search: "" }),
  }),
);
