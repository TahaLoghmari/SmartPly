import { useMutation } from "@tanstack/react-query";
import { type ForgotPasswordDto, forgotPassword } from "#/auth";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (credentials: ForgotPasswordDto) => forgotPassword(credentials),
  });
}
