import { create } from "zustand";
import { type ApplicationFilterStoreType } from "#/applications";
import {
  type ApplicationStatus,
  type ApplicationType,
  type ApplicationLevel,
  type ApplicationJobType,
} from "#/applications";

export function useApplicationFiltersStore<T>(defaultValue: T) {
  return create<ApplicationFilterStoreType<T>>((set) => ({
    isFilterOpen: false,
    selectedFilter: defaultValue,
    setIsFilterOpen: (open) => set({ isFilterOpen: open }),
    setSelectedFilter: (value) => set({ selectedFilter: value }),
    clear: () => set({ selectedFilter: defaultValue }),
  }));
}

export const useApplicationStatusFilterStore =
  useApplicationFiltersStore<ApplicationStatus>("allStatus");
export const useApplicationTypeFilterStore =
  useApplicationFiltersStore<ApplicationType>("allTypes");
export const useApplicationLevelFilterStore =
  useApplicationFiltersStore<ApplicationLevel>("allLevels");
export const useApplicationJobTypeFilterStore =
  useApplicationFiltersStore<ApplicationJobType>("allJobTypes");
