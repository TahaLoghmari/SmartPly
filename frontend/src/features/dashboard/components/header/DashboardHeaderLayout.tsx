import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  DashboardHeaderTitle,
  DashboardHeaderGmailConnectionStatus,
  DashboardHeaderAddApplicationButton,
  DashboardHeaderNotificationBell,
} from "#/dashboard";

export function DashboardHeaderLayout() {
  return (
    <div className="border-border flex items-center justify-between border-b px-6 py-4 transition-all duration-300">
      <DashboardHeaderTitle />
      <div className="flex items-center gap-6 px-3 py-2">
        <DashboardHeaderGmailConnectionStatus />
        <DashboardHeaderAddApplicationButton />
        <DashboardHeaderNotificationBell />
        <ModeToggle />
      </div>
    </div>
  );
}
