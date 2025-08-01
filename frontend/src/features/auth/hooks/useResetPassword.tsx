import { useMutation } from "@tanstack/react-query";
import { resetPassword, type ResetPasswordDto } from "#/auth";
import { useNavigate } from "react-router-dom";
import { handleApiError, type ProblemDetailsDto } from "@/index";

export function useResetPassword() {
  const navigate = useNavigate();
  return useMutation<void, ProblemDetailsDto, ResetPasswordDto>({
    mutationFn: resetPassword,
    onSuccess: () => navigate("/login"),
    onError: (error) => handleApiError({ apiError: error }),
  });
}
