import { LayoutDashboard, FileText, Mail, FileStack } from "lucide-react";
import { useActiveNavItemStore, useSideBarState } from "../../../dashboard";

export function SideBarNavigation() {
  const { activeNavItem, setActiveNavItem } = useActiveNavItemStore();
  const { activeState } = useSideBarState();
  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "applications", icon: FileText, label: "Applications" },
    { id: "resumes", icon: FileStack, label: "Resumes" },
    { id: "gmail", icon: Mail, label: "Gmail" },
  ] as const;
  return (
    <div className="flex flex-1 flex-col gap-2 border-b border-gray-200 p-4">
      {navItems.map(({ id, icon: Icon, label }) => (
        <div
          key={id}
          className={`flex h-10 w-full cursor-pointer items-center rounded-md px-3 text-sm font-medium transition-all duration-200 ${
            activeState ? "justify-start gap-3" : "justify-center"
          } ${
            activeNavItem === id
              ? "bg-gradient-to-r from-[#6c79e1] to-[#7057b0] text-white shadow-md"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setActiveNavItem(id)}
        >
          <Icon className="h-4 w-4 flex-shrink-0" />
          {activeState && <p className="whitespace-nowrap">{label}</p>}
        </div>
      ))}
    </div>
  );
}
