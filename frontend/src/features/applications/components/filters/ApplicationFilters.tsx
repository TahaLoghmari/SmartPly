import {
  ApplicationClearFiltersButton,
  ApplicationFilterBar,
  ApplicationSearchBar,
  useApplicationStatusFilterStore,
  useApplicationTypeFilterStore,
  useApplicationLevelFilterStore,
  useApplicationJobTypeFilterStore,
  applicationsStatusOptionsConstant,
  applicationsTypeOptionsConstant,
  applicationsLevelOptionsConstant,
  applicationsJobTypeOptionsConstant,
} from "#/applications";

export function ApplicationFilters() {
  const {
    isFilterOpen: isStatusFilterOpen,
    setIsFilterOpen: setIsStatusFilterOpen,
    selectedFilter: selectedStatusFilter,
    setSelectedFilter: setSelectedStatusFilter,
  } = useApplicationStatusFilterStore();
  const {
    isFilterOpen: isTypeFilterOpen,
    setIsFilterOpen: setIsTypeFilterOpen,
    selectedFilter: selectedTypeFilter,
    setSelectedFilter: setSelectedTypeFilter,
  } = useApplicationTypeFilterStore();

  const {
    isFilterOpen: isLevelFilterOpen,
    setIsFilterOpen: setIsLevelFilterOpen,
    selectedFilter: selectedLevelFilter,
    setSelectedFilter: setSelectedLevelFilter,
  } = useApplicationLevelFilterStore();

  const {
    isFilterOpen: isJobTypeFilterOpen,
    setIsFilterOpen: setIsJobTypeFilterOpen,
    selectedFilter: selectedJobTypeFilter,
    setSelectedFilter: setSelectedJobTypeFilter,
  } = useApplicationJobTypeFilterStore();
  return (
    <div className="bg-card text-card-foreground flex flex-wrap items-center gap-4 rounded-lg border p-4 shadow-xs">
      <ApplicationSearchBar />
      <ApplicationFilterBar
        key={"Status"}
        isFilterOpen={isStatusFilterOpen}
        selectedFilter={selectedStatusFilter}
        setIsFilterOpen={setIsStatusFilterOpen}
        setSelectedFilter={setSelectedStatusFilter}
        applicationConstant={applicationsStatusOptionsConstant}
        name={"Status"}
      />
      <ApplicationFilterBar
        key={"Type"}
        isFilterOpen={isTypeFilterOpen}
        selectedFilter={selectedTypeFilter}
        setIsFilterOpen={setIsTypeFilterOpen}
        setSelectedFilter={setSelectedTypeFilter}
        applicationConstant={applicationsTypeOptionsConstant}
        name={"Type"}
      />
      <ApplicationFilterBar
        key={"Level"}
        isFilterOpen={isLevelFilterOpen}
        selectedFilter={selectedLevelFilter}
        setIsFilterOpen={setIsLevelFilterOpen}
        setSelectedFilter={setSelectedLevelFilter}
        applicationConstant={applicationsLevelOptionsConstant}
        name={"Level"}
      />
      <ApplicationFilterBar
        key={"Job Type"}
        isFilterOpen={isJobTypeFilterOpen}
        selectedFilter={selectedJobTypeFilter}
        setIsFilterOpen={setIsJobTypeFilterOpen}
        setSelectedFilter={setSelectedJobTypeFilter}
        applicationConstant={applicationsJobTypeOptionsConstant}
        name={"Job Type"}
      />
      <ApplicationClearFiltersButton />
    </div>
  );
}
