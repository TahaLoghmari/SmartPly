import type { RouteObject } from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";

export const authRoutes: RouteObject[] = [
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
];
