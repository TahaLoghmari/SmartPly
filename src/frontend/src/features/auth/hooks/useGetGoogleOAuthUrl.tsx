import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";

export function useGetGoogleOAuthUrl() {
  return useMutation({
    mutationFn: authApi.getGoogleOAuthUrl,
    onSuccess: (url: string) => {
      window.location.href = url;
    },
    onError: (error) => {
      console.error("Failed to get Google OAuth URL:", error);
    },
  });
}
