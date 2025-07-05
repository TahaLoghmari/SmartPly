import { create } from "zustand";
import { type CoverLetterStoreType, coverLettersConstant } from "#/documents";

export const useCoverLetterStore = create<CoverLetterStoreType>((set) => ({
  coverLettersState: coverLettersConstant,
  setCoverLettersState: (coverLetter) =>
    set({ coverLettersState: coverLetter }),
}));
