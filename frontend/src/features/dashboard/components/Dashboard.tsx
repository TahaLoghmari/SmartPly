import {
  DashboardSidebar,
  DashboardSidebarLogoutButton,
  DashboardHeader,
  useDashboardSidebarStateStore,
  useSignalRNotifications,
} from "#/dashboard";
import { useSearchParams, Outlet } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "#/auth";
import { useCurrentScreenSize } from "@/index";

export function Dashboard() {
  const { setIsSidebarOpen } = useDashboardSidebarStateStore();
  const { data: user, isPending } = useCurrentUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const isInboxRoute = location.pathname.includes("inbox");
  const { currentScreenSize } = useCurrentScreenSize();

  useSignalRNotifications(user?.id);

  // this is for google signin/signup failing or any error when the redirection is comming from the backend with an error
  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      toast.error(message);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (isInboxRoute || (currentScreenSize >= 768 && currentScreenSize < 1280))
      setIsSidebarOpen(false);
    else setIsSidebarOpen(true);
  }, [setIsSidebarOpen, isInboxRoute, currentScreenSize]);

  if (isPending)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="flex">
      <DashboardSidebar />
      <div className="flex h-svh flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <Outlet />
        {/* this is a dialog */}
        <DashboardSidebarLogoutButton />
      </div>
    </div>
  );
}
