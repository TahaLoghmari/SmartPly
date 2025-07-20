import { create } from "zustand";

interface SelectedDocumentsStore<T> {
  selected: T[];
  setSelected: (rows: T[]) => void;
  clearSelected: () => void;
}

export const useSelectedDocumentsStore = create<SelectedDocumentsStore<any>>()(
  (set) => ({
    selected: [],
    setSelected: (rows) => set({ selected: rows }),
    clearSelected: () => set({ selected: [] }),
  }),
);
