import { Outlet } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { useAuthOnMount } from "../features/auth";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";

export default function App() {
  const { isLoading } = useAuthOnMount();

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  else
    return (
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Outlet />
        <Toaster />
      </ThemeProvider>
    );
}
