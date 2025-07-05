import { create } from "zustand";
import { type ResumeStoreType, resumesConstant } from "#/documents";

export const useResumeStore = create<ResumeStoreType>((set) => ({
  resumesState: resumesConstant,
  setResumesState: (resumes) => set({ resumesState: resumes }),
}));
