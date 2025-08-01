import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register, type RegisterUserDto } from "#/auth";
import { handleApiError, type ProblemDetailsDto } from "@/index";

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation<void, ProblemDetailsDto, RegisterUserDto>({
    mutationFn: register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
