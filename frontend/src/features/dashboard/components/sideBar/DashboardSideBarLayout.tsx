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
      className={`fixed flex h-screen ${activeState ? "w-65" : "w-20"} flex-col border-r transition-all duration-300`}
    >
      <DashboardSideBarLogo />
      <DashboardSideBarHeader />
      <DashboardSideBarNavigation />
      <DashboardSideBarAI />
      <DashboardSideBarFooter />
    </div>
  );
}
