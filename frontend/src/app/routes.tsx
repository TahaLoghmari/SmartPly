import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { authRoutes } from "../features/auth";
import { HomePage } from "../features/home";
import { dashboardRoutes } from "../features/dashboard/dashboardRoutes";

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
