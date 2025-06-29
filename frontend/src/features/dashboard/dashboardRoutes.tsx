import type { RouteObject } from "react-router-dom";
import { DashboardLayout } from "#/dashboard";
import { ProtectedRoute } from "../../shared";

export const appRoutes: RouteObject[] = [
  {
    path: "app",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
  },
];
