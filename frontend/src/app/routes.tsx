import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { authRoutes } from "../features/auth/authRoutes";
import HomePage from "../features/home/components/HomePage";
import { appRoutes } from "../features/app/appRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      ...authRoutes,
      ...appRoutes,
    ],
  },
]);
