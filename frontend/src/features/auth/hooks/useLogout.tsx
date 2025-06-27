import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/authApi";

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["currentUser"] });
    },
  });
}
