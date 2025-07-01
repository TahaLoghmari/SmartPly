import {
  ApplicationClearFiltersButton,
  ApplicationFilterBar,
  ApplicationSearchBar,
  useApplicationsFilters,
} from "#/applications";

export function ApplicationFiltersLayout() {
  const { filters } = useApplicationsFilters();

  return (
    <div className="bg-card text-card-foreground flex flex-wrap items-center gap-4 rounded-lg border p-4 shadow-xs">
      <ApplicationSearchBar />
      {filters.map((filter) => (
        <ApplicationFilterBar
          key={filter.name}
          isFilterOpen={filter.isFilterOpen}
          selectedFilter={filter.selectedFilter}
          setIsFilterOpen={filter.setIsFilterOpen}
          setSelectedFilter={filter.setSelectedFilter}
          applicationConstant={filter.constant}
          name={filter.name}
        />
      ))}
      <ApplicationClearFiltersButton />
    </div>
  );
}
