import { useEffect } from "react";
import { useCurrentUser, useAuthStore } from "../../auth";

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
