import { Bell } from "lucide-react";
import { useDashboardNotificationsCount } from "#/dashboard";

export function DashboardHeaderNotificationBell() {
  const { notificationsCount } = useDashboardNotificationsCount();
  return (
    <div className="hover:text-accent-foreground relative flex h-9 cursor-pointer items-center rounded-md px-3 hover:bg-gray-200">
      <Bell className="h-4 w-4" />
      {notificationsCount > 0 && (
        <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full p-2 text-xs">
          {notificationsCount}
        </span>
      )}
    </div>
  );
}
