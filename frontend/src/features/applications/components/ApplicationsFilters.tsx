import {
  ApplicationClearFiltersButton,
  ApplicationFilterbar,
  useApplicationStatusFilterStore,
  useApplicationTypeFilterStore,
  useApplicationLevelFilterStore,
  useApplicationJobTypeFilterStore,
  APPLICATIONS_STATUS_OPTIONS,
  APPLICATIONS_TYPE_OPTIONS,
  APPLICATIONS_LEVEL_OPTIONS,
  APPLICATIONS_JOB_TYPE_OPTIONS,
  useApplicationSearchBarStore,
} from "#/applications";
import { SearchBar } from "@/components/SearchBar";

export default function ApplicationsFilters() {
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

  const { search, setSearch } = useApplicationSearchBarStore();

  return (
    <div className="text-card-foreground mb-4 flex flex-col gap-2 xl:flex-row">
      <div className="flex flex-1 flex-col items-center gap-4 lg:flex-row">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search for roles or companies"
          className="w-full lg:w-sm"
        />
        <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          <ApplicationFilterbar
            key={"Status"}
            selectedFilter={selectedStatusFilter}
            setSelectedFilter={setSelectedStatusFilter}
            applicationConstant={APPLICATIONS_STATUS_OPTIONS}
            name={"Status"}
          />
          <ApplicationFilterbar
            key={"Type"}
            selectedFilter={selectedTypeFilter}
            setSelectedFilter={setSelectedTypeFilter}
            applicationConstant={APPLICATIONS_TYPE_OPTIONS}
            name={"Type"}
          />
          <ApplicationFilterbar
            key={"Level"}
            selectedFilter={selectedLevelFilter}
            setSelectedFilter={setSelectedLevelFilter}
            applicationConstant={APPLICATIONS_LEVEL_OPTIONS}
            name={"Level"}
          />
          <ApplicationFilterbar
            key={"Job Type"}
            selectedFilter={selectedJobTypeFilter}
            setSelectedFilter={setSelectedJobTypeFilter}
            applicationConstant={APPLICATIONS_JOB_TYPE_OPTIONS}
            name={"Job Type"}
          />
        </div>
      </div>
      <ApplicationClearFiltersButton />
    </div>
  );
}
