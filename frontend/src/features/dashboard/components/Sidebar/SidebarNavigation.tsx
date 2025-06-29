import { LayoutDashboard, FileText, Mail, FileStack } from "lucide-react";
import { useActiveNavItemStore } from "../../../dashboard";

export function SidebarNavigation() {
  const { activeNavItem, setActiveNavItem } = useActiveNavItemStore();
  return (
    <div className="flex flex-1 flex-col gap-2 border-b border-gray-200 p-4 transition-all duration-300">
      <div
        className={`flex h-10 w-full cursor-pointer items-center justify-start gap-3 rounded-md px-3 text-sm font-medium transition-all duration-200 ${activeNavItem === "dashboard" ? "bg-gradient-to-r from-[#6c79e1] to-[#7057b0] text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}`}
        onClick={() => setActiveNavItem("dashboard")}
      >
        <LayoutDashboard className="h-4 w-4" />
        <p>Dashboard</p>
      </div>
      <div
        className={`flex h-10 w-full cursor-pointer items-center justify-start gap-3 rounded-md px-3 text-sm font-medium transition-all duration-200 ${activeNavItem === "applications" ? "bg-gradient-to-r from-[#6c79e1] to-[#7057b0] text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}`}
        onClick={() => setActiveNavItem("applications")}
      >
        <FileText className="h-4 w-4" />
        <p>Applications</p>
      </div>
      <div
        className={`flex h-10 w-full cursor-pointer items-center justify-start gap-3 rounded-md px-3 text-sm font-medium transition-all duration-200 ${activeNavItem === "resumes" ? "bg-gradient-to-r from-[#6c79e1] to-[#7057b0] text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}`}
        onClick={() => setActiveNavItem("resumes")}
      >
        <FileStack className="h-4 w-4" />
        <p>Resumes</p>
      </div>
      <div
        className={`flex h-10 w-full cursor-pointer items-center justify-start gap-3 rounded-md px-3 text-sm font-medium transition-all duration-200 ${activeNavItem === "gmail" ? "bg-gradient-to-r from-[#6c79e1] to-[#7057b0] text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}`}
        onClick={() => setActiveNavItem("gmail")}
      >
        <Mail className="h-4 w-4" />
        <p>Gmail</p>
      </div>
    </div>
  );
}
