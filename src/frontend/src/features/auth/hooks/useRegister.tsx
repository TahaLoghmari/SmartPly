import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/authApi";

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}
