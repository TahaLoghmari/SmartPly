import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCurrentUser } from "#/settings";
import { useNavigate } from "react-router-dom";
import { handleApiError, type ProblemDetailsDto } from "@/index";

export function useDeleteCurrentUser() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation<void, ProblemDetailsDto, void>({
    mutationFn: deleteCurrentUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate("/login");
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
