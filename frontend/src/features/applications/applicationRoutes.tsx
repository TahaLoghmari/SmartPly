import type { RouteObject } from "react-router-dom";
import {
  Applications,
  ApplicationCreateWrapper,
  ApplicationPage,
} from "#/applications";

export const applicationRoutes: RouteObject[] = [
  {
    path: "applications",
    element: <Applications />,
    children: [
      {
        path: "add",
        element: <ApplicationCreateWrapper />,
      },
    ],
  },
  {
    path: "applications/:id",
    element: <ApplicationPage />,
  },
];
