import { type DocumentSearchBarStore } from "#/documents";
import { create } from "zustand";

export const useDocumentSearchBarStore = create<DocumentSearchBarStore>(
  (set) => ({
    search: "",
    setSearch: (value) => set({ search: value }),
    clear: () => set({ search: "" }),
  }),
);
