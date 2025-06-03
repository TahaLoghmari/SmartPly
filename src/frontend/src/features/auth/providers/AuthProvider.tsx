// This file manages authentication state and provides auth functions to the app via React Context
// It uses authApi for HTTP requests and updates state based on responses
import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authApi } from "../api/authApi";
import type {
  AuthState,
  AuthContextType,
  LoginUserDto,
  RegisterUserDto,
} from "../types";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    setState((s) => ({ ...s, isLoading: true }));
    authApi
      .getCurrentUser()
      .then((user) =>
        setState({ user, isAuthenticated: true, isLoading: false, error: null })
      )
      .catch(() => setState({ ...initialState, isLoading: false }));
  }, []);

  const login = async (credentials: LoginUserDto) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      await authApi.login(credentials);
      const user = await authApi.getCurrentUser();
      setState({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (error: any) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: error.title || error.message || "Login failed",
      }));
      throw error;
    }
  };

  const register = async (credentials: RegisterUserDto) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      await authApi.register(credentials);
      const user = await authApi.getCurrentUser();
      setState({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (error: any) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: error.title || error.message || "Registration failed",
      }));
      throw error;
    }
  };

  const logout = async () => {
    await authApi.logout();
    setState(initialState);
  };

  const refreshAuth = async () => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      await authApi.refresh();
      const user = await authApi.getCurrentUser();
      setState({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch {
      setState(initialState);
    }
  };

  const clearError = () => setState((s) => ({ ...s, error: null }));

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshAuth,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
