import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteApplication } from "#/applications";
import { useCurrentUser } from "#/auth";
import { useNavigate } from "react-router-dom";
import { handleApiError, type ProblemDetailsDto } from "@/index";

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const navigate = useNavigate();
  return useMutation<void, ProblemDetailsDto, string>({
    mutationFn: deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", user?.id] });
      navigate("/app/applications");
    },
    onError: handleApiError,
  });
}
