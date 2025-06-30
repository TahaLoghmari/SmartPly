import { create } from "zustand";
import { type ApplicationsWishListState } from "..";

export const useApplicationsWishListCountStore =
  create<ApplicationsWishListState>((set) => ({
    wishListCount: 5,
    setWishListCount: (item) => set({ wishListCount: item }),
  }));
