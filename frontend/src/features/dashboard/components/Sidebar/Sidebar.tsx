import {
  SidebarHeader,
  SidebarNavigation,
  SidebarAI,
  SidebarFooter,
} from "../../../dashboard";
import { Briefcase, ChevronLeft } from "lucide-react";

export function Sidebar() {
  return (
    <div className="fixed flex h-screen w-65 flex-col border-r border-gray-200 transition-all duration-300">
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#6c79e1] to-[#7057b0]">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
          <p className="font-bold text-gray-900">SmartPly</p>
        </div>
        {/* Arrow */}
        <button className="flex cursor-pointer items-center justify-center rounded-md p-2 hover:bg-[#f1f4f8]">
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
      <SidebarHeader />
      <SidebarNavigation />
      <SidebarAI />
      <SidebarFooter />
    </div>
  );
}
