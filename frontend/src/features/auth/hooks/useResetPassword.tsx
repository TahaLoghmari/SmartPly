import { useMutation } from "@tanstack/react-query";
import { authApi, type ResetPasswordDto } from "../../auth";
import { useNavigate } from "react-router-dom";

export function useResetPassword() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (credentials: ResetPasswordDto) =>
      authApi.resetPassword(credentials),
    onSuccess: () => navigate("/login"),
  });
}
