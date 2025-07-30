import { useMutation } from "@tanstack/react-query";
import { type ForgotPasswordDto, forgotPassword } from "#/auth";
import { handleApiError, type ProblemDetailsDto } from "@/index";

export function useForgotPassword() {
  return useMutation<string, ProblemDetailsDto, ForgotPasswordDto>({
    mutationFn: forgotPassword,
    onError: handleApiError,
  });
}
