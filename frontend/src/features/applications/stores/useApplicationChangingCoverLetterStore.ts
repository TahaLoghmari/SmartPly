import { type ChangingCoverLetterStore } from "#/applications";
import { create } from "zustand";

export const useApplicationChangingCoverLetterStore =
  create<ChangingCoverLetterStore>((set) => ({
    isChangingCoverLetter: false,
    setIsChangingCoverLetter: (value) => set({ isChangingCoverLetter: value }),
  }));
