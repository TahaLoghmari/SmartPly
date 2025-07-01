import { Button } from "@/components/ui/button";
import { useApplicationClearAllFilters } from "#/applications";

export function ApplicationClearFiltersButton() {
  const clearAll = useApplicationClearAllFilters();
  return (
    <Button variant="ghost" className="border" onClick={clearAll}>
      Clear Filters
    </Button>
  );
}
