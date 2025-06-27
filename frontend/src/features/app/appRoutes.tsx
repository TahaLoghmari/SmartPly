import type { RouteObject } from "react-router-dom";
import Test from "./components/Test";

export const appRoutes: RouteObject[] = [
  {
    path: "app",
    element: <Test />,
  },
];
