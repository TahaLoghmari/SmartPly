import type { RouteObject } from "react-router-dom";
import { Applications, ApplicationsPage } from "#/applications";

export const applicationRoutes: RouteObject[] = [
  {
    path: "applications",
    element: <Applications />,
    children: [
      {
        path: ":id",
        element: <ApplicationsPage />,
      },
    ],
  },
];
