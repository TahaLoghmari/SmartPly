import {
  Searchbar,
  GmailConnectionStatus,
  NotificationBell,
  AddApplicationButton,
  Title,
} from "../../../dashboard";
import { ModeToggle } from "@/components/ui/mode-toggle";

export function Header() {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 transition-all duration-300">
      <Title />
      <div className="flex items-center gap-6 px-3 py-2">
        <GmailConnectionStatus />
        <Searchbar />
        <AddApplicationButton />
        <NotificationBell />
        <ModeToggle />
      </div>
    </div>
  );
}
