import { useMutation } from "@tanstack/react-query";
import { resendConfirmationEmail } from "#/auth";

export function useResendConfirmationEmail() {
  return useMutation({
    mutationFn: async (email: string) => {
      return resendConfirmationEmail(email);
    },
  });
}
