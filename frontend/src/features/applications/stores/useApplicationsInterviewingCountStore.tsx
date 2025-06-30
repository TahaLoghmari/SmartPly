import { create } from "zustand";
import { type ApplicationsInterviewingState } from "..";

export const useApplicationsInterviewingCountStore =
  create<ApplicationsInterviewingState>((set) => ({
    interviewingCount: 3,
    setInterviewingCount: (item) => set({ interviewingCount: item }),
  }));
