import { AuthProvider } from "../features/auth/providers/AuthProvider";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
