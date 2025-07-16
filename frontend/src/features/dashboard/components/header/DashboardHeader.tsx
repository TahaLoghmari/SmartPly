import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  HeaderTitle,
  GmailConnectionStatus,
  AddApplicationButton,
  NotificationBell,
} from "#/dashboard";

export function DashboardHeader() {
  return (
    <div className="border-border flex items-center justify-between border-b px-6 py-4 transition-[width,height,margin,padding] duration-300">
      <HeaderTitle />
      <div className="flex items-center gap-6 px-3 py-2">
        <GmailConnectionStatus />
        <AddApplicationButton />
        <NotificationBell />
        <ModeToggle />
      </div>
    </div>
  );
}
