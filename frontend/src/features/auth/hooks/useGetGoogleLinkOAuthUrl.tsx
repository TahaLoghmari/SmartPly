import { useMutation } from "@tanstack/react-query";
import { authApi } from "#/auth";

export function useGetGoogleLinkOAuthUrl() {
  return useMutation({
    mutationFn: authApi.getGoogleLinkOAuthUrl,
    onSuccess: (data) => {
      window.location.href = data.authorizationUrl;
    },
    onError: (error) => {
      console.error("Failed to get Google Link OAuth URL:", error);
    },
  });
}
