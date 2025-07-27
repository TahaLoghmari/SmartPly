import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bulkdDeleteApplication } from "#/applications";
import { useCurrentUser } from "#/auth";
import { useNavigate } from "react-router-dom";
import type { BulkDeleteRequestDto } from "@/types";

export function useBulkDeleteApplications() {
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (credentials: BulkDeleteRequestDto) =>
      bulkdDeleteApplication(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", user?.id] });
      navigate("/app/applications");
    },
  });
}
