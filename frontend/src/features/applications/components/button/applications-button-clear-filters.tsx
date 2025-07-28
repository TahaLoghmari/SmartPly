import { Button } from "@/components/ui/button";
import { useApplicationClearAllFilters } from "#/applications";

export function ApplicationsButtonClearFilters() {
  const clearAll = useApplicationClearAllFilters();
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
