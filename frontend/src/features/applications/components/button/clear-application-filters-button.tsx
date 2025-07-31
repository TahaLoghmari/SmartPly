import { Button } from "@/components/ui/button";
import { useApplicationClearFilters } from "#/applications";

export function ClearApplicationFiltersButton() {
  const clearAll = useApplicationClearFilters();
  return (
    <Button
      variant="ghost"
      className="bg-card hover:bg-accent dark:hover:bg-accent border duration-0"
      onClick={clearAll}
    >
      Clear Filters
    </Button>
  );
}
