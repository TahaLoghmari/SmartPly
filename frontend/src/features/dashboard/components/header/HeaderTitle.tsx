import { useDashboardTitleStore } from "#/dashboard";

export function HeaderTitle() {
  const { dashboardTitleState } = useDashboardTitleStore();
  return (
    <div className="flex-col">
      <p className="text-xl font-bold">{dashboardTitleState}</p>
      {/* Active Applications - This Week Applications */}
      <div></div>
    </div>
  );
}
