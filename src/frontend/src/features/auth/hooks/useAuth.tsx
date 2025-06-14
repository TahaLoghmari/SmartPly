import { createContext, useState } from "react";
import type { AuthState } from "../types";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

export const AuthContext = createContext<AuthState | undefined>(undefined);

export function useAuth() {
  const [state, setState] = useState<AuthState>(initialState);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
