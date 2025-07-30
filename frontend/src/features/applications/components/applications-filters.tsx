import {
  ApplicationsButtonClearFilters,
  ApplicationsFilterbar,
  useApplicationStatusFilterStore,
  useApplicationTypeFilterStore,
  useApplicationLevelFilterStore,
  useApplicationJobTypeFilterStore,
  applicationsStatusOptionsConstant,
  applicationsTypeOptionsConstant,
  applicationsLevelOptionsConstant,
  applicationsJobTypeOptionsConstant,
  useApplicationSearchBarStore,
} from "#/applications";
import { SearchBar } from "@/components/SearchBar";

export function ApplicationsFilters() {
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
    <div className="text-card-foreground mb-4 flex flex-wrap items-center gap-4 rounded-lg">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search for roles or companies"
      />
      <ApplicationsFilterbar
        key={"Status"}
        selectedFilter={selectedStatusFilter}
        setSelectedFilter={setSelectedStatusFilter}
        applicationConstant={applicationsStatusOptionsConstant}
        name={"Status"}
      />
      <ApplicationsFilterbar
        key={"Type"}
        selectedFilter={selectedTypeFilter}
        setSelectedFilter={setSelectedTypeFilter}
        applicationConstant={applicationsTypeOptionsConstant}
        name={"Type"}
      />
      <ApplicationsFilterbar
        key={"Level"}
        selectedFilter={selectedLevelFilter}
        setSelectedFilter={setSelectedLevelFilter}
        applicationConstant={applicationsLevelOptionsConstant}
        name={"Level"}
      />
      <ApplicationsFilterbar
        key={"Job Type"}
        selectedFilter={selectedJobTypeFilter}
        setSelectedFilter={setSelectedJobTypeFilter}
        applicationConstant={applicationsJobTypeOptionsConstant}
        name={"Job Type"}
      />
      <ApplicationsButtonClearFilters />
    </div>
  );
}
