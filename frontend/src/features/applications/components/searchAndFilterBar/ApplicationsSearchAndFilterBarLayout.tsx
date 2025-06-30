import {
  ApplicationsClearFiltersButton,
  ApplicationsFilterBar,
  ApplicationsSearchBar,
  useApplicationsFilters,
} from "#/applications";

export function ApplicationsSearchAndFilterBarLayout() {
  const { filters } = useApplicationsFilters();

  return (
    <div className="bg-card text-card-foreground flex flex-wrap items-center gap-4 rounded-lg border p-4 shadow-xs">
      <ApplicationsSearchBar />
      {filters.map((filter) => (
        <ApplicationsFilterBar
          key={filter.name}
          isFilterOpen={filter.isFilterOpen}
          selectedFilter={filter.selectedFilter}
          setIsFilterOpen={filter.setIsFilterOpen}
          setSelectedFilter={filter.setSelectedFilter}
          applicationConstant={filter.constant}
          name={filter.name}
        />
      ))}
      <ApplicationsClearFiltersButton />
    </div>
  );
}
