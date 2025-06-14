import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";

export function useResendConfirmationEmail() {
  return useMutation({
    mutationFn: authApi.resendConfirmationEmail,
  });
}
