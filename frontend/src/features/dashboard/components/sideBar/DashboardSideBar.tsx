import {
  useDashboardSideBarStore,
  SideBarLogo,
  SideBarHeader,
  SideBarNavigation,
  SideBarFooter,
} from "#/dashboard";

export function DashboardSideBar() {
  const { activeState } = useDashboardSideBarStore();
  return (
    <div
      className={`bg-card flex h-screen ${activeState ? "w-64" : "w-20"} flex-col border-r transition-[width,height,margin,padding] duration-300`}
    >
      <SideBarLogo />
      <SideBarHeader />
      <SideBarNavigation />
      <SideBarFooter />
    </div>
  );
}
