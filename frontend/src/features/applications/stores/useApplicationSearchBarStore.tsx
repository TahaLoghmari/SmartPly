import { type ApplicationSearchBarStore } from "#/applications";
import { create } from "zustand";

export const useApplicationSearchBarStore = create<ApplicationSearchBarStore>(
  (set) => ({
    search: "",
    setSearch: (value) => set({ search: value }),
    clear: () => set({ search: "" }),
  }),
);
