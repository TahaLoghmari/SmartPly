import { useMutation } from "@tanstack/react-query";
import { resendConfirmationEmail } from "#/auth";
import { handleApiError } from "@/index";

export function useResendConfirmationEmail() {
  return useMutation({
    mutationFn: async (email: string) => {
      return resendConfirmationEmail(email);
    },
    onError: handleApiError,
  });
}
