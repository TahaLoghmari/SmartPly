import {
  useDashboardActiveNavItemStore,
  dashboardHeaderNavigationTitlesConstant,
} from "#/dashboard";

export function DashboardHeaderTitle() {
  const { activeNavItemState } = useDashboardActiveNavItemStore();
  return (
    <div className="flex-col">
      <p className="text-xl font-bold">
        {dashboardHeaderNavigationTitlesConstant[activeNavItemState]}
      </p>
      {/* Active Applications - This Week Applications */}
      <div></div>
    </div>
  );
}
