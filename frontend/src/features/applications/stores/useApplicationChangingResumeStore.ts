import { type ChangingResumeStore } from "#/applications";
import { create } from "zustand";

export const useApplicationChangingResumeStore = create<ChangingResumeStore>(
  (set) => ({
    isChangingResume: false,
    setIsChangingResume: (value) => set({ isChangingResume: value }),
  }),
);
