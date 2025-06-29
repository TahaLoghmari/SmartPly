import { useDashboardActiveNavItemStore, navigationTitles } from "#/dashboard";

export function DashboardHeaderTitle() {
  const { activeNavItem } = useDashboardActiveNavItemStore();
  return (
    <div className="flex-col">
      <p className="text-xl font-bold">{navigationTitles[activeNavItem]}</p>
      {/* Active Applications - This Week Applications */}
      <div></div>
    </div>
  );
}
