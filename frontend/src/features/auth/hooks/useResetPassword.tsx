import { useMutation } from "@tanstack/react-query";
import { resetPassword, type ResetPasswordDto } from "#/auth";
import { useNavigate } from "react-router-dom";

export function useResetPassword() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (credentials: ResetPasswordDto) =>
      resetPassword(credentials),
    onSuccess: () => navigate("/login"),
  });
}
