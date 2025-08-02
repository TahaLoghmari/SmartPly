import {
  DashboardSidebar,
  DashboardSidebarLogoutButton,
  DashboardHeader,
} from "#/dashboard";
import { useSearchParams, Outlet } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "#/auth";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function Dashboard() {
  const { isLoading } = useCurrentUser();
  const [searchParams, setSearchParams] = useSearchParams();

  // this is for google signin/signup failing or any error when the redirection is comming from the backend with an error
  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      toast.error(message);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner className="dark:invert" />
      </div>
    );

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <DashboardSidebar variant="inset" />
      <SidebarInset>
        <DashboardHeader />
        <Outlet />
        <DashboardSidebarLogoutButton />
      </SidebarInset>
    </SidebarProvider>
  );
}
