import {
  useApplicationLevelFilterStore,
  useApplicationTypeFilterStore,
  useApplicationStatusFilterStore,
  useApplicationJobTypeFilterStore,
  applicationsLevelFilterOptionsConstant,
  applicationsStatusFilterOptionsConstant,
  applicationsTypeFilterOptionsConstant,
  applicationsJobTypeFilterOptionsConstant,
} from "#/applications";

export function useApplicationsFilters() {
  const statusFilter = useApplicationStatusFilterStore();
  const typeFilter = useApplicationTypeFilterStore();
  const levelFilter = useApplicationLevelFilterStore();
  const jobTypeFilter = useApplicationJobTypeFilterStore();

  const filters = [
    {
      ...statusFilter,
      constant: applicationsStatusFilterOptionsConstant,
      name: "Status",
    },
    {
      ...typeFilter,
      constant: applicationsTypeFilterOptionsConstant,
      name: "Type",
    },
    {
      ...levelFilter,
      constant: applicationsLevelFilterOptionsConstant,
      name: "Level",
    },
    {
      ...jobTypeFilter,
      constant: applicationsJobTypeFilterOptionsConstant,
      name: "Job Type",
    },
  ];

  return { filters };
}
