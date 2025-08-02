import {
  ApplicationClearFiltersButton,
  ApplicationFilterbar,
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

export default function Filters() {
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
        className="w-sm"
      />
      <ApplicationFilterbar
        key={"Status"}
        selectedFilter={selectedStatusFilter}
        setSelectedFilter={setSelectedStatusFilter}
        applicationConstant={applicationsStatusOptionsConstant}
        name={"Status"}
      />
      <ApplicationFilterbar
        key={"Type"}
        selectedFilter={selectedTypeFilter}
        setSelectedFilter={setSelectedTypeFilter}
        applicationConstant={applicationsTypeOptionsConstant}
        name={"Type"}
      />
      <ApplicationFilterbar
        key={"Level"}
        selectedFilter={selectedLevelFilter}
        setSelectedFilter={setSelectedLevelFilter}
        applicationConstant={applicationsLevelOptionsConstant}
        name={"Level"}
      />
      <ApplicationFilterbar
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
