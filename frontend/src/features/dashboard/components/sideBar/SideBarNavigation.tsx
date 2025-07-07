import {
  Mail,
  ClipboardList,
  Users,
  FileText,
  Bell,
  ChartColumn,
} from "lucide-react";
import { useDashboardTitleStore, useDashboardSideBarStore } from "#/dashboard";
import { useNavigate } from "react-router-dom";

export function SideBarNavigation() {
  const navigate = useNavigate();
  const { dashboardTitleState } = useDashboardTitleStore();
  const { activeState } = useDashboardSideBarStore();
  const navItems = [
    { id: "applications", icon: ClipboardList, label: "Applications" },
    { id: "analytics", icon: ChartColumn, label: "Analytics" },
    { id: "contacts", icon: Users, label: "Contacts" },
    { id: "documents", icon: FileText, label: "Documents" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "gmail", icon: Mail, label: "Gmail" },
  ] as const;
  return (
    <div className="flex flex-1 flex-col gap-2 border-b p-2">
      {navItems.map(({ id, icon: Icon, label }) => (
        <div
          key={id}
          className={`text-secondary-foreground flex h-10 w-full cursor-pointer items-center rounded-md px-3 text-sm font-medium transition-all duration-200 ${
            activeState ? "justify-start gap-3" : "justify-center"
          } ${dashboardTitleState === id ? "bg-secondary" : "hover:bg-secondary/80"}`}
          onClick={() => navigate(`/app/${id}`)}
        >
          <Icon className="h-4 w-4 flex-shrink-0" />
          {activeState && <p className="whitespace-nowrap">{label}</p>}
        </div>
      ))}
    </div>
  );
}
