import type { RouteObject } from "react-router-dom";
import {
  LoginPage,
  RegisterPage,
  EmailVerificationPage,
  EmailConfirmedPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from "../auth";

export const authRoutes: RouteObject[] = [
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "email-verification",
    element: <EmailVerificationPage />,
  },
  {
    path: "email-confirmed",
    element: <EmailConfirmedPage />,
  },
  {
    path: "forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "reset-password",
    element: <ResetPasswordPage />,
  },
];
