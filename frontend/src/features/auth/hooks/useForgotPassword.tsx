import { useMutation } from "@tanstack/react-query";
import { type ForgotPasswordDto, forgotPassword } from "#/auth";
import { handleApiError } from "@/index";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (credentials: ForgotPasswordDto) => forgotPassword(credentials),
    onError: handleApiError,
  });
}
