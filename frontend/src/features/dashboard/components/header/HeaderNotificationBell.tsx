import { Bell } from "lucide-react";
import { useDashboardNotificationsCountStore } from "#/dashboard";

export default function HeaderNotificationBell() {
  const { notificationsCountState } = useDashboardNotificationsCountStore();
  return (
    <div className="hover:text-accent-foreground relative flex h-8 cursor-pointer items-center rounded-md px-3 hover:bg-gray-200">
      <Bell className="h-4 w-4" />
      {notificationsCountState > 0 && (
        <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full p-[9px] text-xs">
          {notificationsCountState}
        </span>
      )}
    </div>
  );
}
