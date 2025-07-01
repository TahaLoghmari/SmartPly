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
  useApplicationFiltersStore<ApplicationStatus>("All Status");
export const useApplicationTypeFilterStore =
  useApplicationFiltersStore<ApplicationType>("All Types");
export const useApplicationLevelFilterStore =
  useApplicationFiltersStore<ApplicationLevel>("All Levels");
export const useApplicationJobTypeFilterStore =
  useApplicationFiltersStore<ApplicationJobType>("All Job Types");
