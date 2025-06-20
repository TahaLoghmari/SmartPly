import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import type { ForgotPasswordDto } from "../types";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (credentials: ForgotPasswordDto) =>
      authApi.forgotPassword(credentials),
  });
}
