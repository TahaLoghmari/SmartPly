import { useMutation } from "@tanstack/react-query";
import { type ForgotPasswordDto, authApi } from "../../auth";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (credentials: ForgotPasswordDto) =>
      authApi.forgotPassword(credentials),
  });
}
