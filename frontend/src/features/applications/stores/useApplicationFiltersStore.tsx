import { create } from "zustand";
import { type ApplicationFilterStoreType } from "#/applications";

export function useApplicationFiltersStore(defaultValue: string) {
  return create<ApplicationFilterStoreType>((set) => ({
    isFilterOpen: false,
    selectedFilter: defaultValue,
    setIsFilterOpen: (open) => set({ isFilterOpen: open }),
    setSelectedFilter: (value) => set({ selectedFilter: value }),
    clear: () => set({ selectedFilter: defaultValue }),
  }));
}
