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
import * as signalR from "@microsoft/signalr";
import { useQueryClient } from "@tanstack/react-query";
import type { NotificationResponseDto } from "#/notifications";

export function Dashboard() {
  const { isSidebarOpen, setIsSidebarOpen } = useDashboardSidebarStateStore();
  const { data: user, isPending } = useCurrentUser();
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

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000/hubs/notifications", {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => console.log("Connected to SignalR"))
      .catch((err) => console.error("Connection failed: ", err));

    connection.on(
      "NotificationReceived",
      (notification: NotificationResponseDto) => {
        queryClient.invalidateQueries({
          queryKey: ["notifications", user?.id],
        });

        if (notification.title === "Initial Email Sync Completed") {
          queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        }
      },
    );

    connection.onclose((err) => {
      console.error("SignalR disconnected", err);
    });

    return () => {
      connection.stop();
    };
  }, [user?.id, queryClient]);

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
