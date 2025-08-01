import { useMutation } from "@tanstack/react-query";
import { resendConfirmationEmail } from "#/auth";
import { handleApiError, type ProblemDetailsDto } from "@/index";

export function useResendConfirmationEmail() {
  return useMutation<void, ProblemDetailsDto, string>({
    mutationFn: resendConfirmationEmail,
    onError: (error) => handleApiError({ apiError: error }),
  });
}
