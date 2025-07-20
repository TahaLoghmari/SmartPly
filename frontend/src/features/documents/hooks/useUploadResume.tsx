import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type ResumeRequestDto, uploadResume } from "#/documents";
import { useCurrentUser } from "#/auth";

export function useUploadResume() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: ResumeRequestDto) => uploadResume(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["resumes", user?.id],
      });
    },
  });
}
