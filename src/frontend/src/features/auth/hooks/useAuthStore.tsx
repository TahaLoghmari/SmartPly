import { create } from "zustand";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthState: (state: Partial<AuthState>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setAuthState: (state) => set((prev) => ({ ...prev, ...state })),
  logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
}));
