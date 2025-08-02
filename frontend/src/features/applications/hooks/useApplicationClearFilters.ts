import {
  useApplicationStatusFilterStore,
  useApplicationLevelFilterStore,
  useApplicationTypeFilterStore,
  useApplicationJobTypeFilterStore,
} from "#/applications";

export function useApplicationClearFilters() {
  const { clear: clearStatusFilter } = useApplicationStatusFilterStore();
  const { clear: clearLevelFilter } = useApplicationLevelFilterStore();
  const { clear: clearTypeFilter } = useApplicationTypeFilterStore();
  const { clear: clearJobTypeFilter } = useApplicationJobTypeFilterStore();

  return () => {
    clearStatusFilter();
    clearLevelFilter();
    clearTypeFilter();
    clearJobTypeFilter();
  };
}
