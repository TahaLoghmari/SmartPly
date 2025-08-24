import { NavLink } from "react-router-dom";
import type { SidebarNavProps } from "#/dashboard/types";
import { useDashboardSidebarStateStore } from "#/dashboard";

export default function DashboardSidebarNavSecondary({
  items,
}: SidebarNavProps) {
  const { isSidebarOpen } = useDashboardSidebarStateStore();
  return (
    <div className="flex flex-col gap-1 p-2">
      {items.map((item) => (
        <NavLink
          to={`/app/${item.url}`}
          key={item.title}
          className={({ isActive }) =>
            `flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm ${isActive ? "bg-primary text-secondary" : "hover:bg-sidebar-accent"}`
          }
        >
          {item.icon && <item.icon className="h-4 w-4" />}
          {isSidebarOpen && <span>{item.title}</span>}
        </NavLink>
      ))}
    </div>
  );
}
