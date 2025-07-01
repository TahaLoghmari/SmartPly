import { create } from "zustand";
import {
  type ApplicationCardStoreType,
  applicationCardsConstant,
} from "#/applications";

export const useApplicationCardsStore = create<ApplicationCardStoreType>(
  (set) => ({
    applicationCardsState: applicationCardsConstant,
    setApplicationCardsState: (cards) => set({ applicationCardsState: cards }),
  }),
);
