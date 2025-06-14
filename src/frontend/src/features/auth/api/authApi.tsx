import type { LoginUserDto, RegisterUserDto, User } from "../types";
import { request } from "./client";

export const authApi = {
  login(credentials: LoginUserDto) {
    return request<string>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register(credentials: RegisterUserDto) {
    return request<string>("/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  logout() {
    return request<string>("/auth/logout", {
      method: "POST",
    });
  },

  getGoogleOAuthUrl() {
    return request<string>(
      "/auth/google/authorize",
    );
  },

  refresh() {
    return request<string>("/auth/refresh", {
      method: "POST",
    });
  },

  getCurrentUser() {
    return request<User>("/auth/me");
  },

  resendConfirmationEmail(email: string) {
    return request<string>("/auth/resend-confirmation-email", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
};
