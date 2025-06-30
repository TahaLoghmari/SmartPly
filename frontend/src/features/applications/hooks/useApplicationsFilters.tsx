import {
  useApplicationsLevelFilterStore,
  useApplicationsTypeFilterStore,
  useApplicationsStatusFilterStore,
  useApplicationsJobTypeFilterStore,
  applicationsLevel,
  applicationsStatus,
  applicationsType,
  applicationsJobType,
} from "#/applications";

export function useApplicationsFilters() {
  const statusFilter = useApplicationsStatusFilterStore();
  const typeFilter = useApplicationsTypeFilterStore();
  const levelFilter = useApplicationsLevelFilterStore();
  const jobTypeFilter = useApplicationsJobTypeFilterStore();

  const filters = [
    {
      isFilterOpen: statusFilter.isStatusFilterOpen,
      selectedFilter: statusFilter.selectedStatusFilter,
      setIsFilterOpen: statusFilter.setIsStatusFilterOpen,
      setSelectedFilter: statusFilter.setSelectedFilterStatus,
      constant: applicationsStatus,
      name: "Status",
    },
    {
      isFilterOpen: typeFilter.isTypeFilterOpen,
      selectedFilter: typeFilter.selectedTypeFilter,
      setIsFilterOpen: typeFilter.setIsTypeFilterOpen,
      setSelectedFilter: typeFilter.setSelectedFilterType,
      constant: applicationsType,
      name: "Type",
    },
    {
      isFilterOpen: levelFilter.isLevelFilterOpen,
      selectedFilter: levelFilter.selectedLevelFilter,
      setIsFilterOpen: levelFilter.setIsLevelFilterOpen,
      setSelectedFilter: levelFilter.setSelectedFilterLevel,
      constant: applicationsLevel,
      name: "Level",
    },
    {
      isFilterOpen: jobTypeFilter.isJobTypeFilterOpen,
      selectedFilter: jobTypeFilter.selectedJobTypeFilter,
      setIsFilterOpen: jobTypeFilter.setIsJobTypeFilterOpen,
      setSelectedFilter: jobTypeFilter.setSelectedFilterJobType,
      constant: applicationsJobType,
      name: "Job Type",
    },
  ];

  return { filters };
}
