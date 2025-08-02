import type { RouteObject } from "react-router-dom";
import { Applications, ApplicationPage } from "#/applications";

const applicationRoutes: RouteObject[] = [
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

export default applicationRoutes;
