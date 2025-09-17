import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { NotificationResponseDto } from "#/notifications";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export function useSignalRNotifications(userId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/notifications`, {
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
        queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
      })
      .catch((err) => console.error("Connection failed: ", err));

    connection.on(
      "NotificationReceived",
      (notification: NotificationResponseDto) => {
        queryClient.invalidateQueries({
          queryKey: ["notifications", userId],
        });

        if (notification.title === "Initial Email Sync Completed") {
          queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        }

        if (
          notification.title === "New Application Created" ||
          notification.title === "Application Match Found"
        ) {
          queryClient.invalidateQueries({
            queryKey: ["applications", userId],
          });
          queryClient.invalidateQueries({
            queryKey: ["application", notification.applicationId],
          });
          queryClient.invalidateQueries({
            queryKey: ["emails", userId],
          });
        }

        toast.message(notification.title, {
          description: (
            <p className="text-muted-foreground text-xs">
              {notification.message}
            </p>
          ),
        });
      },
    );

    connection.onclose((err) => {
      console.error("SignalR disconnected", err);
    });

    return () => {
      connection.stop();
    };
  }, [userId, queryClient]);
}
