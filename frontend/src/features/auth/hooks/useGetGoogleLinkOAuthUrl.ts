import { useMutation } from "@tanstack/react-query";
import { getGoogleLinkOAuthUrl, type GoogleAuthResponseDto } from "#/auth";
import { handleApiError, type ProblemDetailsDto } from "@/index";

export function useGetGoogleLinkOAuthUrl() {
  return useMutation<GoogleAuthResponseDto, ProblemDetailsDto, void>({
    mutationFn: getGoogleLinkOAuthUrl,
    onSuccess: (data) => {
      window.location.href = data.authorizationUrl;
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
