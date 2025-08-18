import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useGetNotifications,
  useMarkAllNotificationsRead,
} from "#/notifications";
import { Spinner } from "@/components/ui/spinner";

export function Notifications() {
  const { data: notifications, isLoading, isError } = useGetNotifications();
  const markAllNotificationsReadMutation = useMarkAllNotificationsRead();

  if (isLoading) return <div>Loading..</div>;
  if (isError) return <div>Error</div>;

  const allNotifications =
    notifications?.pages.flatMap((page) => page.items) ?? [];

  const totalNotifications = notifications?.pages.flatMap(
    (page) => page.totalCount,
  )[0];

  const totalNotificationsUnread = allNotifications.filter(
    (n) => n.isRead === false,
  ).length;

  return (
    <div className="flex flex-1 flex-col items-center overflow-auto transition-[width,height,margin,padding] duration-300">
      <div className="flex w-[50%] flex-col gap-7 p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-3xl font-bold tracking-tight">Notifications</p>
            <p className="text-muted-foreground mt-1">
              Stay updated with your job applications and important alerts.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-36 rounded-sm"
            onClick={() => markAllNotificationsReadMutation.mutate()}
          >
            {markAllNotificationsReadMutation.isPending ? (
              <Spinner className="h-5 w-5 border-2" />
            ) : (
              "Mark all as read"
            )}
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{totalNotifications} Total</Badge>
          <Badge variant="default">{totalNotificationsUnread} Unread</Badge>
        </div>
      </div>
    </div>
  );
}
