import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetNotifications } from "#/notifications";

export function Notifications() {
  const { data: notifications, isLoading, isError } = useGetNotifications();

  if (isLoading) return <div>Loading..</div>;
  if (isError) return <div>Error</div>;
  console.log(notifications);
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
          <Button variant="outline" className="rounded-sm">
            Mark all as read
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">0 Total</Badge>
          <Badge variant="default">3 Unread</Badge>
        </div>
      </div>
    </div>
  );
}
