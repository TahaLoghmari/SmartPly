import { Button } from "@/components/ui/button";
import { useApplicationClearAllFilters } from "#/applications";

export function ApplicationClearFiltersButton() {
  const clearAll = useApplicationClearAllFilters();
  return (
    <Button
      variant="ghost"
      className="bg-card hover:bg-accent dark:hover:bg-accent border"
      onClick={clearAll}
    >
      Clear Filters
    </Button>
  );
}
