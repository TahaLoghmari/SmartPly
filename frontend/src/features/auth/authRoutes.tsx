import type { RouteObject } from "react-router-dom";
import {
  LoginPage,
  RegisterPage,
  EmailVerificationPage,
  EmailVerificationResultPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  GuestGuard,
} from "#/auth";

const authRoutes: RouteObject[] = [
  {
    path: "login",
    element: (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    ),
  },
  {
    path: "register",
    element: (
      <GuestGuard>
        <RegisterPage />
      </GuestGuard>
    ),
  },
  {
    path: "email-verification",
    element: (
      <GuestGuard>
        <EmailVerificationPage />
      </GuestGuard>
    ),
  },
  {
    path: "email-confirmed",
    element: (
      <GuestGuard>
        <EmailVerificationResultPage />
      </GuestGuard>
    ),
  },
  {
    path: "forgot-password",
    element: (
      <GuestGuard>
        <ForgotPasswordPage />
      </GuestGuard>
    ),
  },
  {
    path: "reset-password",
    element: (
      <GuestGuard>
        <ResetPasswordPage />
      </GuestGuard>
    ),
  },
];

export default authRoutes;
