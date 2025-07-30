import { CopyCheck, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  ApplicationsButtonDelete,
  useApplicationManageJobsStore,
  useGetUserApplications,
  useBulkDeleteApplications,
} from "#/applications";
import { Checkbox } from "@/components/ui/checkbox";

export function ApplicationsManageJobs() {
  const bulkDeleteApplicationsMutation = useBulkDeleteApplications();
  const {
    setIsSelecting,
    isSelecting,
    selectedApplications,
    clearSelectedApplications,
    setSelectedApplications,
  } = useApplicationManageJobsStore();
  const { data } = useGetUserApplications();

  const allItems = data?.pages.flatMap((page) => page.items) ?? [];
  
  return (
    <div
      className="text-muted-foreground mb-4 flex h-[35px] cursor-pointer items-center gap-2 text-sm font-bold"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSelecting(true);
      }}
    >
      {!isSelecting ? (
        <>
          <CopyCheck className="h-4 w-4" />
          <p>Manage Jobs</p>
        </>
      ) : (
        <div
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-2"
        >
          <Checkbox
            className="border-muted-foreground"
            checked={selectedApplications.length > 0}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedApplications(
                  allItems.map((applicationCard) => applicationCard.id),
                );
              } else {
                clearSelectedApplications();
              }
            }}
          />
          <p>{selectedApplications.length} Jobs Selected</p>
        </div>
      )}

      <Separator
        orientation="vertical"
        className="mx-2 data-[orientation=vertical]:h-4"
      />
      {isSelecting && (
        <div className="flex items-center gap-3">
          {selectedApplications.length > 0 && (
            <ApplicationsButtonDelete
              onDelete={() =>
                bulkDeleteApplicationsMutation.mutate(
                  {
                    Ids: selectedApplications,
                  },
                  {
                    onSuccess: () => {
                      clearSelectedApplications();
                      setIsSelecting(false);
                    },
                  },
                )
              }
              isLoading={bulkDeleteApplicationsMutation.isPending}
            />
          )}
          <div
            className="hover:text-strong-muted-foreground flex items-center gap-2 text-sm font-bold"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsSelecting(false);
            }}
          >
            <X className="size-3" />
            <span>Done</span>
          </div>
        </div>
      )}
    </div>
  );
}
