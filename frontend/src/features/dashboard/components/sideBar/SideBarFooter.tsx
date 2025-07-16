import { Settings } from "lucide-react";
import { useDashboardSideBarStore, SideBarLogoutButton } from "#/dashboard";
import { NavLink } from "react-router-dom";

export function SideBarFooter() {
  const { activeState } = useDashboardSideBarStore();
  return (
    <div className="border-border flex flex-col gap-2 border-b p-2 transition-[width,height,margin,padding] duration-300">
      <NavLink
        key="settings"
        to={`/app/settings`}
        className={({ isActive }) =>
          `text-secondary-foreground flex h-10 w-full items-center rounded-md px-3 text-sm font-medium transition-[width,height,margin,padding] duration-200 ${activeState ? "justify-start gap-3" : "justify-center"} ${isActive ? "bg-secondary" : "hover:bg-secondary/80"} `
        }
      >
        <Settings className="h-4 w-4 flex-shrink-0" />
        {activeState && <p className="whitespace-nowrap">Settings</p>}
      </NavLink>

      <SideBarLogoutButton />
    </div>
  );
}
