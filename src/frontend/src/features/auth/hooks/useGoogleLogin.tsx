import { useState } from "react";
import { useAuth } from "./useAuth";

export function useGoogleLogin() {
  const { getGoogleOAuthUrl, isLoading, error } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      await getGoogleOAuthUrl();
    } catch (err: any) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleGoogleLogin,
    isLoading: isLoading || isSubmitting,
    error,
  };
}