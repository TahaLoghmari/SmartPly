import { useEffect } from "react";
import { useCurrentUser } from "./useCurrentUser";
import { useAuthStore } from "../stores/useAuthStore";

export function useAuthOnMount() {
  const { data: user, isLoading, isError } = useCurrentUser();
  const { setAuthState } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      setAuthState({
        user,
        isAuthenticated: !!user && !isError,
        isLoading: false,
      });
    }
  }, [user, isLoading, isError, setAuthState]);

  return { isLoading };
}
