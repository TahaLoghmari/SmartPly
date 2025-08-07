import { type RouteObject } from "react-router-dom";
import { EmailPage, EmailPageEmpty } from "#/inbox";

const inboxRoutes: RouteObject[] = [
  {
    path: "inbox",
    element: <EmailPageEmpty />,
  },
  {
    path: "inbox/:id",
    element: <EmailPage />,
  },
];

export default inboxRoutes;
