import { create } from "zustand";
import { type ApplicationPageNavigationStore } from "#/applications";

export const useApplicationPageNavigationStore =
  create<ApplicationPageNavigationStore>((set) => ({
    navigationPage: "Overview",
    setNavigationPage: (page) => set({ navigationPage: page }),
  }));
