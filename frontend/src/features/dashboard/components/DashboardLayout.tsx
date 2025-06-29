import {
  useDashboardSideBarState,
  useDashboardActiveNavItemStore,
  navigationComponents,
  DashboardSideBarLayout,
  DashboardHeaderLayout,
} from "#/dashboard";

export function DashboardLayout() {
  const { activeState } = useDashboardSideBarState();
  const { activeNavItem } = useDashboardActiveNavItemStore();
  const ActiveComponent = navigationComponents[activeNavItem];
  return (
    <div className="flex w-full">
      <DashboardSideBarLayout />
      <div
        className={` ${activeState ? "ml-65" : "ml-20"} h-screen w-full bg-[#f8fafa] transition-all duration-300`}
      >
        <DashboardHeaderLayout />
        <ActiveComponent />
      </div>
    </div>
  );
}
