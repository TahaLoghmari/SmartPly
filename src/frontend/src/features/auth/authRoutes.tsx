import type { RouteObject } from "react-router-dom";
import {
  LoginPage,
  RegisterPage,
  EmailVerificationPage,
  EmailConfirmedPage,
  ForgotPasswordPage,
  ForgotPasswordForm,
  ResetPasswordSent,
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
    children: [
      {
        path: "",
        element: <ForgotPasswordForm />,
      },
      {
        path: "password-reset-sent",
        element: <ResetPasswordSent />,
      },
    ],
  },
];
