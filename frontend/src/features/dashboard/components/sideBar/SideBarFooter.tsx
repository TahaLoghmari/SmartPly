import { Settings } from "lucide-react";
import {
  useDashboardTitleStore,
  useDashboardSideBarStore,
  SideBarLogoutButton,
} from "#/dashboard";
import { useNavigate } from "react-router-dom";

export function SideBarFooter() {
  const navigate = useNavigate();
  const { dashboardTitleState } = useDashboardTitleStore();
  const { activeState } = useDashboardSideBarStore();
  return (
    <div className="border-border flex flex-col gap-2 border-b p-2 transition-all duration-300">
      <div
        className={`text-secondary-foreground flex h-10 w-full cursor-pointer items-center rounded-md px-3 text-sm font-medium transition-all duration-200 ${dashboardTitleState === "Settings" ? "bg-secondary" : "hover:bg-secondary/80"} ${!activeState ? "justify-center" : "justify-start gap-3"}`}
        onClick={() => navigate("/app/settings")}
      >
        <Settings className="h-4 w-4 flex-shrink-0" />
        {activeState && <p className="whitespace-nowrap">Settings</p>}
      </div>

      <SideBarLogoutButton />
    </div>
  );
}
