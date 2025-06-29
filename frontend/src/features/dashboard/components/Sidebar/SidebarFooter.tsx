import { Settings, LogOut } from "lucide-react";
import { useActiveNavItemStore } from "../../../dashboard";

export function SidebarFooter() {
  const { activeNavItem, setActiveNavItem } = useActiveNavItemStore();
  return (
    <div className="flex flex-col gap-2 border-b border-gray-200 p-4 transition-all duration-300">
      <div
        className={`flex h-10 w-full cursor-pointer items-center justify-start gap-3 rounded-md px-3 text-sm font-medium transition-all duration-200 ${activeNavItem === "settings" ? "bg-gradient-to-r from-[#6c79e1] to-[#7057b0] text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}`}
        onClick={() => setActiveNavItem("settings")}
      >
        <Settings className="h-4 w-4" />
        <p>Settings</p>
      </div>
      <div
        className={`flex h-10 w-full cursor-pointer items-center justify-start gap-3 rounded-md px-3 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50`}
      >
        <LogOut className="h-4 w-4" />
        <p>Logout</p>
      </div>
    </div>
  );
}
