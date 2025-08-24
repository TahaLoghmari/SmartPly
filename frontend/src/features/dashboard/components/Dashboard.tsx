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
import * as signalR from "@microsoft/signalr";
import { useQueryClient } from "@tanstack/react-query";
import type { NotificationResponseDto } from "#/notifications";
import { useCurrentScreenSize } from "@/index";

export function Dashboard() {
  const { setIsSidebarOpen } = useDashboardSidebarStateStore();
  const { data: user, isPending } = useCurrentUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const isInboxRoute = location.pathname.includes("inbox");
  const { currentScreenSize } = useCurrentScreenSize();

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
      .then(() => {
        console.log("Connected to SignalR");
        // this is to handle the situation if my backend sends a notification before my websocket
        // connection is established
        queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
      })
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
