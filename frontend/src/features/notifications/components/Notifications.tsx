import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useGetNotifications,
  useMarkAllNotificationsRead,
  Notification,
  type NotificationResponseDto,
} from "#/notifications";
import { Spinner } from "@/components/ui/spinner";

export function Notifications() {
  const {
    data: notifications,
    isLoading,
    isError,
    refetch,
  } = useGetNotifications();
  const markAllNotificationsReadMutation = useMarkAllNotificationsRead();

  const allNotifications =
    notifications?.pages.flatMap((page) => page.items) ?? [];

  const totalNotifications = notifications?.pages.flatMap(
    (page) => page.totalCount,
  )[0];

  const totalUnreadNotifications = allNotifications.filter(
    (n) => n.isRead === false,
  ).length;

  return (
    <div className="flex flex-1 flex-col items-center overflow-auto transition-[width,height,margin,padding] duration-300">
      <div className="flex w-full flex-1 flex-col gap-7 p-6 px-3 sm:px-6 lg:w-[90%] xl:w-[75%] 2xl:w-[50%]">
        <div className="flex items-center justify-between gap-5 sm:gap-0">
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
        {isLoading && (
          <div className="flex flex-1 items-center justify-center">
            <Spinner />
          </div>
        )}
        {isError && (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12">
              <span className="text-muted-foreground text-lg">
                Failed to load notifications.
              </span>
              <Button onClick={() => refetch()} className="cursor-pointer">
                {isLoading ? (
                  <Spinner className="h-6 w-6 border-2 invert" />
                ) : (
                  "Retry"
                )}
              </Button>
            </div>
          </div>
        )}
        {!isLoading && !isError && (
          <>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{totalNotifications} Total</Badge>
              <Badge variant="default">{totalUnreadNotifications} Unread</Badge>
            </div>
            {allNotifications.map((notification: NotificationResponseDto) => (
              <Notification key={notification.id} data={notification} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
