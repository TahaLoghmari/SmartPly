import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";

export function useResendConfirmationEmail() {
  return useMutation({
    mutationFn: async (email: string) => {
      return authApi.resendConfirmationEmail(email);
    },
  });
}
