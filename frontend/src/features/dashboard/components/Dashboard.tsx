import {
  DashboardSidebar,
  DashboardSidebarLogoutButton,
  DashboardHeader,
  useDashboardSidebarStateStore,
} from "#/dashboard";
import { useSearchParams, Outlet } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "#/auth";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function Dashboard() {
  const { isSidebarOpen, setIsSidebarOpen } = useDashboardSidebarStateStore();
  const { isPending } = useCurrentUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const isInboxRoute = location.pathname.includes("inbox");

  // this is for google signin/signup failing or any error when the redirection is comming from the backend with an error
  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      toast.error(message);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (isInboxRoute) setIsSidebarOpen(false);
    else setIsSidebarOpen(true);
  }, [setIsSidebarOpen, isInboxRoute]);

  if (isPending)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <SidebarProvider
      open={isSidebarOpen}
      onOpenChange={setIsSidebarOpen}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <DashboardSidebar />
      <SidebarInset className="h-svh">
        <DashboardHeader />
        <Outlet />
        {/* this is a dialog */}
        <DashboardSidebarLogoutButton />
      </SidebarInset>
    </SidebarProvider>
  );
}
