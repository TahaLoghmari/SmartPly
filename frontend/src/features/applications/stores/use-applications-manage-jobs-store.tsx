import { type ApplicationManageJobsStore } from "#/applications";
import { create } from "zustand";

export const useApplicationManageJobsStore = create<ApplicationManageJobsStore>(
  (set) => ({
    isSelecting: false,
    selectedApplications: [],
    setIsSelecting: (isSelecting) => set({ isSelecting: isSelecting }),
    setSelectedApplications: (selectedApplications: string[]) =>
      set(() => ({ selectedApplications: selectedApplications })),
    addApplication: (id: string) =>
      set((state) => ({
        selectedApplications: [...state.selectedApplications, id],
      })),
    removeApplication: (id: string) =>
      set((state) => ({
        selectedApplications: state.selectedApplications.filter(
          (appId) => appId !== id,
        ),
      })),
    clearSelectedApplications: () => set({ selectedApplications: [] }),
  }),
);
