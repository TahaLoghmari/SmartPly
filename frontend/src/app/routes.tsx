import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { authRoutes } from "#/auth";
import { HomePage } from "#/home";
import { dashboardRoutes } from "#/dashboard";
import { PrivacyPolicyPage } from "./PrivacyPolicyPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicyPage />,
      },
      ...authRoutes,
      ...dashboardRoutes,
    ],
  },
]);
