import { useMutation } from "@tanstack/react-query";
import { getGoogleLinkOAuthUrl } from "#/auth";
import { handleApiError, type ProblemDetailsDto } from "@/index";

export function useGetGoogleLinkOAuthUrl() {
  return useMutation<{ authorizationUrl: string }, ProblemDetailsDto, void>({
    mutationFn: getGoogleLinkOAuthUrl,
    onSuccess: (data) => {
      window.location.href = data.authorizationUrl;
    },
    onError: handleApiError,
  });
}
