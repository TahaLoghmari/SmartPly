import { create } from "zustand";
import { type ApplicationFilterStoreType } from "#/applications";

export function useApplicationFiltersStore(defaultValue: string) {
  return create<ApplicationFilterStoreType>((set) => ({
    isOpen: false,
    selected: defaultValue,
    setIsOpen: (open) => set({ isOpen: open }),
    setSelected: (value) => set({ selected: value }),
    clear: () => set({ selected: defaultValue }),
  }));
}
