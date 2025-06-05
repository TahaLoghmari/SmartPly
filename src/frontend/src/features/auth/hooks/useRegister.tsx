import { useState } from "react";
import { useAuth } from "./useAuth";

export function useRegister() {
  const { register, isLoading, error } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (credentials: any) => {
    try {
      setIsSubmitting(true);
      await register(credentials);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Registration failed",
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleRegister,
    isLoading: isLoading || isSubmitting,
    error,
  };
}
