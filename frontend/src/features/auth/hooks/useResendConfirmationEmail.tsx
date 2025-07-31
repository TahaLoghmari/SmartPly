import { useMutation } from "@tanstack/react-query";
import { resendConfirmationEmail } from "#/auth";
import { handleApiError, type ProblemDetailsDto } from "@/index";

export function useResendConfirmationEmail() {
  return useMutation<string, ProblemDetailsDto, string>({
    mutationFn: resendConfirmationEmail,
    onError: handleApiError,
  });
}
