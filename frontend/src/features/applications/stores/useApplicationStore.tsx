import { create } from "zustand";
import {
  type ApplicationStoreType,
  applicationCardsConstant,
} from "#/applications";

export const useApplicationStore = create<ApplicationStoreType>(
  (set) => ({
    applicationCardsState: applicationCardsConstant,
    setApplicationCardsState: (cards) => set({ applicationCardsState: cards }),
  }),
);
