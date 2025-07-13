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
    selectedFilter: defaultValue,
    setSelectedFilter: (value) => set({ selectedFilter: value }),
    clear: () => set({ selectedFilter: defaultValue }),
  }));
}

export const useApplicationStatusFilterStore =
  useApplicationFiltersStore<ApplicationStatus>("");
export const useApplicationTypeFilterStore =
  useApplicationFiltersStore<ApplicationType>("");
export const useApplicationLevelFilterStore =
  useApplicationFiltersStore<ApplicationLevel>("");
export const useApplicationJobTypeFilterStore =
  useApplicationFiltersStore<ApplicationJobType>("");
