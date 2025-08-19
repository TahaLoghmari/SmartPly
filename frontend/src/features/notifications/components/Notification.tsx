import {
  type NotificationResponseDto,
  useMarkNotificationRead,
  NOTIFICATION_TYPE_TO_ICON,
} from "#/notifications";
import { Spinner } from "@/components/ui/spinner";
import { formatDistanceToNow } from "date-fns";

export function Notification({ data }: { data: NotificationResponseDto }) {
  const Icon = NOTIFICATION_TYPE_TO_ICON[data.type];
  const markNotificationReadMutation = useMarkNotificationRead();
  return (
    <div
      className={`${data.isRead ? "bg-card" : "bg-accent"} flex h-[138px] gap-4 rounded-lg border p-4 shadow-xs`}
    >
      <div>
        <div className="bg-muted flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
          <Icon className="text-muted-foreground h-5 w-5" />
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex-1">
          <p className="text-foreground w-full truncate text-sm leading-5 font-medium">
            {data.title}
          </p>
          <p className="text-muted-foreground mt-1 line-clamp-2 w-full text-sm">
            {data.message}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs">
            {formatDistanceToNow(data.createdAt, {
              addSuffix: true,
            })}
          </p>
          {!data.isRead &&
            (markNotificationReadMutation.isPending ? (
              <div className="flex w-20 items-center justify-center">
                <Spinner className="h-4 w-4 border-2" />
              </div>
            ) : (
              <button
                className="hover:text-muted-foreground cursor-pointer text-xs font-semibold"
                onClick={() => markNotificationReadMutation.mutate(data.id)}
              >
                Mark as read
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
