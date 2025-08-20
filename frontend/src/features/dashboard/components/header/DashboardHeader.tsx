import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DashboardHeaderGmailConnectionStatus,
  DashboardHeaderNotificationBell,
  useDashboardSidebarStateStore,
} from "#/dashboard";
import { useCurrentScreenSize } from "@/hooks";

export default function DashboardHeader() {
  const { isSidebarOpen, setIsSidebarOpen } = useDashboardSidebarStateStore();
  const { currentScreenSize } = useCurrentScreenSize();
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger
          className="-ml-1"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          disabled={
            location.pathname.includes("inbox") ||
            (currentScreenSize < 1280 && currentScreenSize >= 768)
          }
          hidden={currentScreenSize < 1280 && currentScreenSize >= 768}
        />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
          hidden={currentScreenSize < 1280 && currentScreenSize >= 768}
        />
        <div className="ml-auto flex items-center gap-2">
          <DashboardHeaderGmailConnectionStatus />
          <DashboardHeaderNotificationBell />
        </div>
      </div>
    </header>
  );
}
