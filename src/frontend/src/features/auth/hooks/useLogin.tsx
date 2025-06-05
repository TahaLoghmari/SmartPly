import { useState } from "react";
import { useAuth } from "./useAuth";
import { validationService } from "../services/validationService";
import type { LoginUserDto } from "../types";

export function useLogin() {
  const { login, isLoading, error } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleLogin = async (credentials: LoginUserDto) => {

    const validation = validationService.validateLoginForm(credentials);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return {
        success: false,
        error: "Please fix the validation errors",
        validationErrors: validation.errors,
      };
    }

    setValidationErrors([]);

    try {
      setIsSubmitting(true);
      await login(credentials);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Login failed",
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearValidationErrors = () => setValidationErrors([]);

  return {
    handleLogin,
    isLoading: isLoading || isSubmitting,
    error,
    validationErrors,
    clearValidationErrors,
  };
}
