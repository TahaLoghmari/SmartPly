import type { RouteObject } from "react-router-dom";
import { Applications, ApplicationPage } from "#/applications";

const applicationsRoutes: RouteObject[] = [
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

export default applicationsRoutes;
