import {
  useDashboardSideBarStore,
  DashboardSideBarLogo,
  DashboardSideBarHeader,
  DashboardSideBarNavigation,
  DashboardSideBarAI,
  DashboardSideBarFooter,
} from "#/dashboard";

export function DashboardSideBarLayout() {
  const { activeState } = useDashboardSideBarStore();
  return (
    <div
      className={`bg-card flex h-screen ${activeState ? "w-64" : "w-20"} flex-col border-r transition-all duration-300`}
    >
      <DashboardSideBarLogo />
      <DashboardSideBarHeader />
      <DashboardSideBarNavigation />
      <DashboardSideBarAI />
      <DashboardSideBarFooter />
    </div>
  );
}
