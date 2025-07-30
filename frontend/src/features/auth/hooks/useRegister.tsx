import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register } from "#/auth";
import { handleApiError } from "@/index";

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: handleApiError,
  });
}
