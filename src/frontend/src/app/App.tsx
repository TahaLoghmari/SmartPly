import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "../features/auth/providers/AuthProvider";
import { Outlet } from "react-router-dom";

const VITE_GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}
