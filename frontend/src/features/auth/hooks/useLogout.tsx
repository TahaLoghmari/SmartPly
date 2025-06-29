import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, useAuthStore } from "../../auth";

export function useLogout() {
  const queryClient = useQueryClient();
  const { logout: clearAuthState } = useAuthStore();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      clearAuthState();
    },
  });
}
