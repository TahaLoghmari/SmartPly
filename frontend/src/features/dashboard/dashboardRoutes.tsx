import type { RouteObject } from "react-router-dom";
import Test from "./components/Test";
import { ProtectedRoute } from "../../shared";

export const appRoutes: RouteObject[] = [
  {
    path: "app",
    element: (
      <ProtectedRoute>
        <Test />
      </ProtectedRoute>
    ),
  },
];
