import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../auth";

export function useResendConfirmationEmail() {
  return useMutation({
    mutationFn: async (email: string) => {
      return authApi.resendConfirmationEmail(email);
    },
  });
}
