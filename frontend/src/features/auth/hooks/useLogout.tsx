import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "#/auth";
import { useNavigate } from "react-router-dom";
import { handleApiError, type ProblemDetailsDto } from "@/index";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return (
    useMutation<string, ProblemDetailsDto, void>,
    {
      mutationFn: logout,
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ["currentUser"] });
        navigate("/login");
      },
      onError: handleApiError,
    }
  );
}
