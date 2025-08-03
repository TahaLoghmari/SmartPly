import { create } from "zustand";
import { type CoverLetterStoreType, COVER_LETTERS } from "#/documents";

export const useCoverLetterStore = create<CoverLetterStoreType>((set) => ({
  coverLettersState: COVER_LETTERS,
  setCoverLettersState: (coverLetter) =>
    set({ coverLettersState: coverLetter }),
}));
