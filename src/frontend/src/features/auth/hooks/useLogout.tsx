import { useState } from "react";
import { useAuth } from "./useAuth";

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
