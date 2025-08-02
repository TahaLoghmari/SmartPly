import type { RouteObject } from "react-router-dom";
import { Applications, ApplicationPage } from "#/applications";

export const applicationRoutes: RouteObject[] = [
  {
    path: "applications",
    element: <Applications />,
    children: [
      {
        path: ":id",
        element: <ApplicationPage />,
      },
    ],
  },
];
