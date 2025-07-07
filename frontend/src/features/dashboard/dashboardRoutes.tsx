import type { RouteObject } from "react-router-dom";
import { Dashboard } from "#/dashboard";
import { ProtectedRoute } from "../../shared";

export const dashboardRoutes: RouteObject[] = [
  {
    path: "app",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
];
