import {
  ApplicationsHeaderLayout,
  ApplicationsSearchBarLayout,
  ApplicationsCardsLayout,
} from "../../applications";

export function ApplicationsLayout() {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-auto p-6 transition-all duration-300">
      <ApplicationsHeaderLayout />
      <ApplicationsSearchBarLayout />
      <ApplicationsCardsLayout />
    </div>
  );
}
