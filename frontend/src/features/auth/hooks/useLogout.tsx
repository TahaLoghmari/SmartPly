import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "#/auth";
import { useNavigate } from "react-router-dom";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      navigate("/login");
    },
  });
}
