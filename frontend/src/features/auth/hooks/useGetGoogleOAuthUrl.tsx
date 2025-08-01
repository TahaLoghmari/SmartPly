import { useMutation } from "@tanstack/react-query";
import { getGoogleOAuthUrl, type GoogleAuthResponseDto } from "#/auth";
import { handleApiError, type ProblemDetailsDto } from "@/index";

export function useGetGoogleOAuthUrl() {
  return useMutation<GoogleAuthResponseDto, ProblemDetailsDto, void>({
    mutationFn: getGoogleOAuthUrl,
    onSuccess: (data) => {
      window.location.href = data.authorizationUrl;
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
