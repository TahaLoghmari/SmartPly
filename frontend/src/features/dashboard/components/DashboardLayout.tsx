import {
  useDashboardActiveNavItemStore,
  dashboardSideBarNavigationComponentsConstant,
  DashboardSideBarLayout,
  DashboardHeaderLayout,
} from "#/dashboard";

export function DashboardLayout() {
  const { activeNavItemState } = useDashboardActiveNavItemStore();
  const ActiveComponent =
    dashboardSideBarNavigationComponentsConstant[activeNavItemState];
  return (
    <div className="bg-background flex h-screen">
      <DashboardSideBarLayout />
      <div
        className={`flex flex-1 flex-col overflow-hidden transition-all duration-300`}
      >
        <DashboardHeaderLayout />
        <ActiveComponent />
      </div>
    </div>
  );
}
