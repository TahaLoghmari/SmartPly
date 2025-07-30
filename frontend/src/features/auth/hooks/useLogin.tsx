import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { type LoginUserDto, login } from "#/auth";
import { type ProblemDetailsDto } from "@/types";
import { handleApiError } from "@/index";

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation<string, ProblemDetailsDto, LoginUserDto>({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate("/app");
    },
    onError: handleApiError,
  });
}
