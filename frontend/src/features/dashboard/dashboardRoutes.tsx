import { Navigate, type RouteObject } from "react-router-dom";
import { Dashboard } from "#/dashboard";
import { UserGuard } from "#/auth";
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
      <UserGuard>
        <Dashboard />
      </UserGuard>
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
