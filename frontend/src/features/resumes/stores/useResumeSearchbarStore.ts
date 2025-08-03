import { type ResumeSearchbarStore } from "#/resumes";
import { create } from "zustand";

export const useResumeSearchbarStore = create<ResumeSearchbarStore>((set) => ({
  search: "",
  setSearch: (value) => set({ search: value }),
  clear: () => set({ search: "" }),
}));
