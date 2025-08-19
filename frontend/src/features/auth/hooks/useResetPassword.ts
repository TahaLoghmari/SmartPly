import { useMutation } from "@tanstack/react-query";
import { resetPassword, type ResetPasswordDto } from "#/auth";
import { useNavigate } from "react-router-dom";
import { handleApiError, type ProblemDetailsDto } from "@/index";
import { toast } from "sonner";

export function useResetPassword() {
  const navigate = useNavigate();
  return useMutation<void, ProblemDetailsDto, ResetPasswordDto>({
    mutationFn: resetPassword,
    onSuccess: () => {
      navigate("/login");
      toast.success("Your password has been reset. You can now log in.");
    },
    onError: (error) => handleApiError({ apiError: error }),
  });
}
