import { useMutation } from "@tanstack/react-query";
import { getGoogleOAuthUrl } from "#/auth";
import { handleApiError } from "@/index";

export function useGetGoogleOAuthUrl() {
  return useMutation({
    mutationFn: getGoogleOAuthUrl,
    onSuccess: (data) => {
      window.location.href = data.authorizationUrl;
    },
    onError: handleApiError,
  });
}
