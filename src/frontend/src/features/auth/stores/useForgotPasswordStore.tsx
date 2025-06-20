import { create } from "zustand";

interface ForgotPasswordState {
  hasClickedResetPassword: boolean;
  email: string;
  setResetPasswordClicked: (email: string) => void;
  clearResetState: () => void;
}

export const useForgotPasswordStore = create<ForgotPasswordState>((set) => ({
  hasClickedResetPassword: false,
  email: "",
  setResetPasswordClicked: (email: string) =>
    set({ hasClickedResetPassword: true, email }),
  clearResetState: () => set({ hasClickedResetPassword: false, email: "" }),
}));
