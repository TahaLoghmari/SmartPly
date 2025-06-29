import { Settings } from "lucide-react";
import {
  useDashboardActiveNavItemStore,
  useDashboardSideBarState,
  DashboardSideBarLogoutButton,
} from "#/dashboard";

export function DashboardSideBarFooter() {
  const { activeNavItem, setActiveNavItem } = useDashboardActiveNavItemStore();
  const { activeState } = useDashboardSideBarState();
  return (
    <div className="flex flex-col gap-2 border-b border-gray-200 p-2 transition-all duration-300">
      <div
        className={`text-secondary-foreground flex h-10 w-full cursor-pointer items-center rounded-md px-3 text-sm font-medium transition-all duration-200 ${activeNavItem === "settings" ? "bg-secondary" : "hover:bg-secondary/80"} ${!activeState ? "justify-center" : "justify-start gap-3"}`}
        onClick={() => setActiveNavItem("settings")}
      >
        <Settings className="h-4 w-4 flex-shrink-0" />
        {activeState && <p className="whitespace-nowrap">Settings</p>}
      </div>

      <DashboardSideBarLogoutButton />
    </div>
  );
}
