import { create } from "zustand";
import { type SelectedResumesStore } from "#/resumes";

export const useSelectedResumesStore = create<SelectedResumesStore<any>>()(
  (set) => ({
    selected: [],
    setSelected: (rows) => set({ selected: rows }),
    clearSelected: () => set({ selected: [] }),
  }),
);
