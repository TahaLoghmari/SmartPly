import type { RouteObject } from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { EmailVerificationPage } from "./components/EmailVerificationPage";
import EmailConfirmedPage from "./components/EmailConfirmedPage";

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
];
