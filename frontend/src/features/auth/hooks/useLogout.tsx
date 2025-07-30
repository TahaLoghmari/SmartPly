import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "#/auth";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "@/index";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      navigate("/login");
    },
    onError: handleApiError,
  });
}
