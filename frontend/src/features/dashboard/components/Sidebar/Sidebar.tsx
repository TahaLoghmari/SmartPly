import {
  SideBarHeader,
  SideBarNavigation,
  SideBarAI,
  SideBarFooter,
  SideBarLogo,
  useSideBarState,
} from "../../../dashboard";

export function SideBar() {
  const { activeState } = useSideBarState();
  return (
    <div
      className={`fixed flex h-screen ${activeState ? "w-65" : "w-20"} flex-col border-r border-gray-200 transition-all duration-300`}
    >
      <SideBarLogo />
      <SideBarHeader />
      <SideBarNavigation />
      <SideBarAI />
      <SideBarFooter />
    </div>
  );
}
