// This file manages authentication state and provides auth functions to the app via React Context
// It uses authApi for HTTP requests and updates state based on responses
// it's for  API orchestration and workflows and  Application state management

import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authApi } from "../api/authApi";
import type {
  AuthState,
  AuthContextType,
  LoginUserDto,
  RegisterUserDto,
} from "../types";
import { useNavigate } from "react-router-dom";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      setState((s) => ({ ...s, isLoading: true }));

      try {
        const user = await authApi.getCurrentUser();
        console.log(user);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error: any) {
        setState({ ...initialState, isLoading: false });
      }
    };
    initializeAuth();
  }, []);

  const login = async (credentials: LoginUserDto) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      await authApi.login(credentials);
      navigate("/app");
      const user = await authApi.getCurrentUser();
      console.log(user);
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
      navigate("/email-verification");
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
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    setState(initialState);
    navigate("/");
  };

  const getGoogleOAuthUrl = async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      await authApi.getGoogleOAuthUrl();
    } catch (error: any) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: error.title || error.message || "Google login failed",
      }));
      throw error;
    }
  };

  const googleLogin = async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const user = await authApi.getCurrentUser();
      setState({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (error: any) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: error.title || error.message || "Google login failed",
      }));
      throw error;
    }
  };

  const refreshAuth = async () => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      await authApi.refresh();
      const user = await authApi.getCurrentUser();
      setState({ user, isAuthenticated: true, isLoading: false, error: null });
      console.log("Token got refreshed");
    } catch {
      setState(initialState);
    }
  };
  const resendConfirmationEmail = async (email: string) => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      await authApi.resendConfirmationEmail(email);
      setState((s) => ({ ...s, isLoading: false }));
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
    getGoogleOAuthUrl,
    googleLogin,
    refreshAuth,
    resendConfirmationEmail,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
