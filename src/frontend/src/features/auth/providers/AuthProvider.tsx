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
import { useLocalStorage } from "../hooks/useLocalStorage";
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
  const { getTokens, clearTokens, setTokens } = useLocalStorage();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      setState((s) => ({ ...s, isLoading: true }));

      const { accessToken, refreshToken } = getTokens();

      // Scenario C: No tokens - redirect to login
      if (!accessToken && !refreshToken) {
        setState({ ...initialState, isLoading: false });
        return;
      }

      try {
        // Scenario A: Try to get user with current access token
        const user = await authApi.getCurrentUser();
        console.log(user);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error: any) {
        // getCurrentUser failed - token might be expired
        if (refreshToken) {
          try {
            // Scenario B: Try to refresh the token
            await authApi.refresh();
            const user = await authApi.getCurrentUser();
            console.log(user);
            setState({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (refreshError) {
            // Scenario C: Refresh failed - clear tokens and show login
            clearTokens();
            navigate("/login");
            setState({ ...initialState, isLoading: false });
          }
        } else {
          // Scenario C: No refresh token - clear and show login
          clearTokens();
          navigate("/login");
          setState({ ...initialState, isLoading: false });
        }
      }
    };
    initializeAuth();
  }, []);

  const login = async (credentials: LoginUserDto) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const response = await authApi.login(credentials);
      setTokens(response);
      navigate("/app");
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
      const response = await authApi.register(credentials);
      console.log("API Response:", response); // Add this line to debug
      setTokens(response);
      navigate("/app");
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
    // await authApi.logout(); this is after I add HTTP-ONLY Cookies
    clearTokens();
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
      const response = await authApi.refresh();
      setTokens(response);
      const user = await authApi.getCurrentUser();
      setState({ user, isAuthenticated: true, isLoading: false, error: null });
      console.log("Token got refreshed");
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
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
