import { createContext, useState, useEffect, type ReactNode } from "react";
import type { AuthState, AuthContextType } from "../types";
import { useCurrentUser } from "../hooks/useCurrentUser";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  // TanStack Query configuration prevents unnecessary re-fetches
  const { data: user, isLoading, isError } = useCurrentUser();

  useEffect(() => {
    setState({
      user: user || null,
      isAuthenticated: !!user && !isError,
      isLoading,
    });
  }, [user, isLoading, isError]);

  const contextValue: AuthContextType = {
    ...state,
    setAuthState: setState,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
