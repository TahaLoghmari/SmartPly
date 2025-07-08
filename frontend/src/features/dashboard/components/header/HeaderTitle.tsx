import {
  useDashboardTitleStore,
  dashboardNavigationTitlesConstant,
} from "#/dashboard";

export function HeaderTitle() {
  const { dashboardTitleState } = useDashboardTitleStore();
  return (
    <div className="flex-col">
      <p className="text-xl font-bold">
        {dashboardNavigationTitlesConstant[dashboardTitleState]}
      </p>
      {/* Active Applications - This Week Applications */}
      <div></div>
    </div>
  );
}
