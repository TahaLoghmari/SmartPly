import { Navigate, type RouteObject } from "react-router-dom";
import { Dashboard } from "#/dashboard";
import { UserGuard } from "#/auth";
import { applicationsRoutes } from "#/applications";
import { Analytics } from "#/analytics";
import { Contacts } from "#/contacts";
import { Documents } from "#/documents";
import { Notifications } from "#/notifications";
import { Settings } from "#/settings";
import { inboxRoutes } from "#/inbox";

const dashboardRoutes: RouteObject[] = [
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
      ...applicationsRoutes,
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
      ...inboxRoutes,
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

export default dashboardRoutes;
