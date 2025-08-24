import {
  DashboardHeaderGmailConnectionStatus,
  DashboardHeaderNotificationBell,
  useDashboardInboxStateStore,
  useDashboardSidebarStateStore,
} from "#/dashboard";
import { useCurrentScreenSize } from "@/hooks";
import { PanelRight } from "lucide-react";

export default function DashboardHeader() {
  const { isSidebarOpen, setIsSidebarOpen } = useDashboardSidebarStateStore();
  const { isInboxOpen, setIsInboxOpen } = useDashboardInboxStateStore();
  const isInboxRoute = location.pathname.includes("inbox");
  const { currentScreenSize } = useCurrentScreenSize();
  return (
    <header className="flex h-12 items-center justify-center border-b">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <div
          className={`hover:bg-accent flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-sm font-medium ${currentScreenSize < 1280 && currentScreenSize >= 768 && !isInboxRoute && "hidden"}`}
          onClick={() => {
            if (!isInboxRoute || (isInboxRoute && currentScreenSize < 768))
              setIsSidebarOpen(!isSidebarOpen);
            else setIsInboxOpen(!isInboxOpen);
          }}
        >
          <PanelRight className={`h-4 w-4`} />
        </div>

        <p
          className={`text-sm text-gray-300 ${currentScreenSize < 1280 && currentScreenSize >= 768 && "hidden"}`}
        >
          |
        </p>
        <div className="ml-auto flex items-center gap-2">
          <DashboardHeaderGmailConnectionStatus />
          <DashboardHeaderNotificationBell />
        </div>
      </div>
    </header>
  );
}
