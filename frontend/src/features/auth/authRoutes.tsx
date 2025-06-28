import type { RouteObject } from "react-router-dom";
import {
  LoginPage,
  RegisterPage,
  EmailVerificationPage,
  EmailConfirmedPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  AuthGuard,
} from "../auth";

export const authRoutes: RouteObject[] = [
  {
    path: "login",
    element: (
      <AuthGuard>
        <LoginPage />
      </AuthGuard>
    ),
  },
  {
    path: "register",
    element: (
      <AuthGuard>
        <RegisterPage />
      </AuthGuard>
    ),
  },
  {
    path: "email-verification",
    element: (
      <AuthGuard>
        <EmailVerificationPage />
      </AuthGuard>
    ),
  },
  {
    path: "email-confirmed",
    element: (
      <AuthGuard>
        <EmailConfirmedPage />
      </AuthGuard>
    ),
  },
  {
    path: "forgot-password",
    element: (
      <AuthGuard>
        <ForgotPasswordPage />
      </AuthGuard>
    ),
  },
  {
    path: "reset-password",
    element: (
      <AuthGuard>
        <ResetPasswordPage />
      </AuthGuard>
    ),
  },
];
