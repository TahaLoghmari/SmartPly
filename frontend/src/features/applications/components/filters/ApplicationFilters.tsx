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
    selectedFilter: selectedStatusFilter,
    setSelectedFilter: setSelectedStatusFilter,
  } = useApplicationStatusFilterStore();
  const {
    selectedFilter: selectedTypeFilter,
    setSelectedFilter: setSelectedTypeFilter,
  } = useApplicationTypeFilterStore();

  const {
    selectedFilter: selectedLevelFilter,
    setSelectedFilter: setSelectedLevelFilter,
  } = useApplicationLevelFilterStore();

  const {
    selectedFilter: selectedJobTypeFilter,
    setSelectedFilter: setSelectedJobTypeFilter,
  } = useApplicationJobTypeFilterStore();
  return (
    <div className="bg-card text-card-foreground flex flex-wrap items-center gap-4 rounded-lg border p-4 shadow-xs">
      <ApplicationSearchBar />
      <ApplicationFilterBar
        key={"Status"}
        selectedFilter={selectedStatusFilter}
        setSelectedFilter={setSelectedStatusFilter}
        applicationConstant={applicationsStatusOptionsConstant}
        name={"Status"}
      />
      <ApplicationFilterBar
        key={"Type"}
        selectedFilter={selectedTypeFilter}
        setSelectedFilter={setSelectedTypeFilter}
        applicationConstant={applicationsTypeOptionsConstant}
        name={"Type"}
      />
      <ApplicationFilterBar
        key={"Level"}
        selectedFilter={selectedLevelFilter}
        setSelectedFilter={setSelectedLevelFilter}
        applicationConstant={applicationsLevelOptionsConstant}
        name={"Level"}
      />
      <ApplicationFilterBar
        key={"Job Type"}
        selectedFilter={selectedJobTypeFilter}
        setSelectedFilter={setSelectedJobTypeFilter}
        applicationConstant={applicationsJobTypeOptionsConstant}
        name={"Job Type"}
      />
      <ApplicationClearFiltersButton />
    </div>
  );
}
