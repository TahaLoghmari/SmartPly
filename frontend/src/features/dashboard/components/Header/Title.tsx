import { navigationTitles, useActiveNavItemStore } from "../../../dashboard";

export function Title() {
  const { activeNavItem } = useActiveNavItemStore();
  return (
    <div className="flex-col">
      <p className="text-xl font-bold">{navigationTitles[activeNavItem]}</p>
      {/* Active Applications - This Week Applications */}
      <div></div>
    </div>
  );
}
