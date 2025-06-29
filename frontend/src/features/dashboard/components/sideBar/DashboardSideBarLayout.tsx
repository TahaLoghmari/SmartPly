import {
  useDashboardSideBarState,
  DashboardSideBarLogo,
  DashboardSideBarHeader,
  DashboardSideBarNavigation,
  DashboardSideBarAI,
  DashboardSideBarFooter,
} from "#/dashboard";

export function DashboardSideBarLayout() {
  const { activeState } = useDashboardSideBarState();
  return (
    <div
      className={`fixed flex h-screen ${activeState ? "w-65" : "w-20"} flex-col border-r border-gray-200 transition-all duration-300`}
    >
      <DashboardSideBarLogo />
      <DashboardSideBarHeader />
      <DashboardSideBarNavigation />
      <DashboardSideBarAI />
      <DashboardSideBarFooter />
    </div>
  );
}
