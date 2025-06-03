// src/features/auth/hooks/useLogin.ts

import { useState } from "react";
import { useAuth } from "../../../app/providers/AuthProvider";
import { LoginCredentials } from "../types";

export function useLogin() {
  const { login, isLoading, error } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (credentials: LoginCredentials) => {
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

  return {
    handleLogin,
    isLoading: isLoading || isSubmitting,
    error,
  };
}

// src/features/auth/hooks/useRegister.ts
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

// src/features/auth/hooks/useLogout.ts
export function useLogout() {
  const { logout, isLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Logout failed",
      };
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    handleLogout,
    isLoading: isLoading || isLoggingOut,
  };
}
