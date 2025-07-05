import type {
  ForgotPasswordDto,
  LoginUserDto,
  RegisterUserDto,
  ResetPasswordDto,
  User,
} from "#/auth";
import { request } from "@/api/client";

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
    return request<{ authorizationUrl: string }>("/auth/google/authorize");
  },

  getGoogleLinkOAuthUrl() {
    return request<{ authorizationUrl: string }>("/auth/google/link");
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

  forgotPassword(credentials: ForgotPasswordDto) {
    return request<string>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  resetPassword(credentials: ResetPasswordDto) {
    return request<string>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },
};
