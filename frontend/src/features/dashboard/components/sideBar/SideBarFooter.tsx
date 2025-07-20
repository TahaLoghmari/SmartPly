import { Settings } from "lucide-react";
import { useDashboardSideBarStore, SideBarLogoutButton } from "#/dashboard";
import { NavLink } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function SideBarFooter() {
  const { activeState } = useDashboardSideBarStore();
  return (
    <div className="flex flex-col gap-2 p-2 transition-[width,height,margin,padding] duration-300">
      <div
        className={`text-secondary-foreground hover:bg-secondary/80 flex h-10 w-full cursor-pointer items-center rounded-md px-3 text-sm font-medium transition-[width,height,margin,padding] duration-200 ${
          activeState ? "justify-start gap-3" : "justify-center"
        }`}
      >
        <Sparkles className="h-4 w-4 flex-shrink-0" />
        {activeState && <p className="whitespace-nowrap">AI Assistant</p>}
      </div>
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
