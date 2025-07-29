import { Navigate, type RouteObject } from "react-router-dom";
import { Dashboard } from "#/dashboard";
import { ProtectedRoute } from "../../shared";
import { applicationRoutes } from "#/applications";
import { Analytics } from "#/analytics";
import { Contacts } from "#/contacts";
import { Documents } from "#/documents";
import { Gmail } from "#/gmail";
import { Notifications } from "#/notifications";
import { Settings } from "#/settings";

export const dashboardRoutes: RouteObject[] = [
  {
    path: "app",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="applications" replace />,
      },
      ...applicationRoutes,
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "contacts",
        element: <Contacts />,
      },
      {
        path: "documents",
        element: <Documents />,
      },
      {
        path: "gmail",
        element: <Gmail />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
];
