import {
  DashboardHeaderGmailConnectionStatus,
  DashboardHeaderNotificationBell,
  useDashboardInboxStateStore,
  useDashboardOverallSidebarState,
  useDashboardSidebarStateStore,
} from "#/dashboard";
import { useCurrentScreenSize } from "@/hooks";
import { PanelRight } from "lucide-react";

export default function DashboardHeader() {
  const { isSidebarOpen, setIsSidebarOpen } = useDashboardSidebarStateStore();
  const { isInboxOpen, setIsInboxOpen } = useDashboardInboxStateStore();
  const { isOverallSidebarOpen, setIsOverallSidebarOpen } =
    useDashboardOverallSidebarState();
  const isInboxRoute = location.pathname.includes("inbox");
  const { currentScreenSize } = useCurrentScreenSize();
  return (
    <header className="flex h-12 items-center justify-center border-b">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <div
          className={`hover:bg-accent flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-sm font-medium ${currentScreenSize < 1280 && currentScreenSize >= 768 && !isInboxRoute && "hidden"}`}
          onClick={() => {
            // if it's desktop screen and it's inbox route, this controls the inbox sidebar state
            // if it's desktop and it's not inbox route, this controls the navigation sidebar state
            // if it's not desktop and it's inbox, this controls the navigation sidebar state which contains both
            if (currentScreenSize < 768) {
              setIsOverallSidebarOpen(!isOverallSidebarOpen);
            } else if (!isInboxRoute) setIsSidebarOpen(!isSidebarOpen);
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
