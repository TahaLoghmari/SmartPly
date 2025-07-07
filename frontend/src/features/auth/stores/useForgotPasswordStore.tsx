import { create } from "zustand";
import { type ForgotPasswordState } from "#/auth";

export const useForgotPasswordStore = create<ForgotPasswordState>((set) => ({
  hasClickedResetPassword: false,
  email: "",
  setResetPasswordClicked: (email: string) =>
    set({ hasClickedResetPassword: true, email }),
  clearResetState: () => set({ hasClickedResetPassword: false, email: "" }),
}));
