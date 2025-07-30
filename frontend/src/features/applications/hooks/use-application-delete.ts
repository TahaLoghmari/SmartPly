import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteApplication } from "#/applications";
import { useCurrentUser } from "#/auth";
import { useNavigate } from "react-router-dom";
import { handleApiError } from "@/index";

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (id: string) => deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", user?.id] });
      navigate("/app/applications");
    },
    onError: handleApiError,
  });
}
