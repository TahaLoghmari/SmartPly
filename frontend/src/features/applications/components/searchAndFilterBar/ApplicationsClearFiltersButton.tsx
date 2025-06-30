import { Button } from "@/components/ui/button";
import {
  useApplicationsStatusFilterStore,
  useApplicationsLevelFilterStore,
  useApplicationsTypeFilterStore,
} from "#/applications";

export function ApplicationsClearFiltersButton() {
  const { clearStatusFilter } = useApplicationsStatusFilterStore();
  const { clearLevelFilter } = useApplicationsLevelFilterStore();
  const { clearTypeFilter } = useApplicationsTypeFilterStore();
  return (
    <Button
      variant="ghost"
      className="border"
      onClick={() => {
        clearStatusFilter();
        clearLevelFilter();
        clearTypeFilter();
      }}
    >
      Clear Filters
    </Button>
  );
}
