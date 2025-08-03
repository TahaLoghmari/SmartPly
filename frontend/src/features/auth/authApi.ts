import type {
  ForgotPasswordDto,
  GoogleAuthResponseDto,
  LoginUserDto,
  RegisterUserDto,
  ResetPasswordDto,
  User,
} from "#/auth";
import { request } from "@/client";

export const login = (credentials: LoginUserDto) => {
  return request<void>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const register = (credentials: RegisterUserDto) => {
  return request<void>("/auth/register", {
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
  return request<GoogleAuthResponseDto>("/auth/google/authorize");
};

export const getGoogleLinkOAuthUrl = () => {
  return request<GoogleAuthResponseDto>("/auth/google/link");
};

export const refresh = () => {
  return request<void>("/auth/refresh", {
    method: "POST",
  });
};

export const getCurrentUser = () => {
  return request<User>("/auth/me");
};

export const resendConfirmationEmail = (email: string) => {
  return request<void>("/auth/resend-confirmation-email", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
};

export const forgotPassword = (credentials: ForgotPasswordDto) => {
  return request<void>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const resetPassword = (credentials: ResetPasswordDto) => {
  return request<void>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};
