import { useMutation } from "@tanstack/react-query";
import { getGoogleOAuthUrl } from "#/auth";

export function useGetGoogleOAuthUrl() {
  return useMutation({
    mutationFn: getGoogleOAuthUrl,
    onSuccess: (data) => {
      window.location.href = data.authorizationUrl;
    },
    onError: (error) => {
      console.error("Failed to get Google OAuth URL:", error);
    },
  });
}
