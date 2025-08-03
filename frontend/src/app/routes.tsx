import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { authRoutes } from "#/auth";
import { HomePage } from "#/home";
import { dashboardRoutes } from "#/dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      ...authRoutes,
      ...dashboardRoutes,
    ],
  },
]);
