import {
  ApplicationsSearchBar,
  ApplicationsStatusFilterBar,
  ApplicationsTypeFilterBar,
  ApplicationsLevelFilterBar,
  ApplicationsClearFiltersButton,
} from "./index";

export function ApplicationsSearchAndFilterBarLayout() {
  return (
    <div className="bg-card text-card-foreground flex flex-wrap items-center gap-4 rounded-lg border p-4 shadow-xs">
      <ApplicationsSearchBar />
      <ApplicationsStatusFilterBar />
      <ApplicationsTypeFilterBar />
      <ApplicationsLevelFilterBar />
      <ApplicationsClearFiltersButton />
    </div>
  );
}
