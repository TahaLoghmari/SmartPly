import { useMutation } from "@tanstack/react-query";
import { getGoogleLinkOAuthUrl } from "#/auth";
import { handleApiError } from "@/index";

export function useGetGoogleLinkOAuthUrl() {
  return useMutation({
    mutationFn: getGoogleLinkOAuthUrl,
    onSuccess: (data) => {
      window.location.href = data.authorizationUrl;
    },
    onError: handleApiError,
  });
}
