import type {
  ForgotPasswordDto,
  LoginUserDto,
  RegisterUserDto,
  ResetPasswordDto,
  User,
} from "#/auth";
import { request } from "@/api/client";

export const login = (credentials: LoginUserDto) => {
  return request<string>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const register = (credentials: RegisterUserDto) => {
  return request<string>("/auth/register", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const logout = () => {
  return request<string>("/auth/logout", {
    method: "POST",
  });
};

export const getGoogleOAuthUrl = () => {
  return request<{ authorizationUrl: string }>("/auth/google/authorize");
};

export const getGoogleLinkOAuthUrl = () => {
  return request<{ authorizationUrl: string }>("/auth/google/link");
};

export const refresh = () => {
  return request<string>("/auth/refresh", {
    method: "POST",
  });
};

export const getCurrentUser = () => {
  return request<User>("/auth/me");
};

export const resendConfirmationEmail = (email: string) => {
  return request<string>("/auth/resend-confirmation-email", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const forgotPassword = (credentials: ForgotPasswordDto) => {
  return request<string>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const resetPassword = (credentials: ResetPasswordDto) => {
  return request<string>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};
