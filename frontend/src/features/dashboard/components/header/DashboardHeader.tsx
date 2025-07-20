import { ModeToggle } from "@/components/ui/mode-toggle";
import { GmailConnectionStatus, NotificationBell } from "#/dashboard";

export function DashboardHeader() {
  return (
    <div className="border-border flex items-center justify-end border-b p-3 transition-[width,height,margin,padding] duration-300">
      <div className="flex items-center gap-6">
        <GmailConnectionStatus />
        <NotificationBell />
        <ModeToggle />
      </div>
    </div>
  );
}
