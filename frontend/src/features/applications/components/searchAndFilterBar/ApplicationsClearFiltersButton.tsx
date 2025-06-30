import { Button } from "@/components/ui/button";
import {
  useApplicationsStatusFilterStore,
  useApplicationsLevelFilterStore,
  useApplicationsTypeFilterStore,
  useApplicationsJobTypeFilterStore,
} from "#/applications";

export function ApplicationsClearFiltersButton() {
  const { clearStatusFilter } = useApplicationsStatusFilterStore();
  const { clearLevelFilter } = useApplicationsLevelFilterStore();
  const { clearTypeFilter } = useApplicationsTypeFilterStore();
  const { clearJobTypeFilter } = useApplicationsJobTypeFilterStore();
  return (
    <Button
      variant="ghost"
      className="border"
      onClick={() => {
        clearStatusFilter();
        clearLevelFilter();
        clearTypeFilter();
        clearJobTypeFilter();
      }}
    >
      Clear Filters
    </Button>
  );
}
