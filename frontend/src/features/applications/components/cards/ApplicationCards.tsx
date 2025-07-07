import {
  ApplicationCard,
  useGetUserApplications,
  type ApplicationResponseDto,
} from "#/applications";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddApplicationButton } from "#/dashboard";
import { Link } from "react-router-dom";

export function ApplicationCards() {
  const {
    data: applicationCardsState = [],
    isLoading,
    isError,
  } = useGetUserApplications();
  if (isLoading) {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <Spinner className="dark:invert" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="text-muted-foreground flex w-full flex-1 flex-col items-center justify-center gap-7">
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-primary text-4xl font-medium">An Error Occured</p>
          <p className="text-sm">Please refresh the page</p>
        </div>
        <Button>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }
  if (applicationCardsState.length > 0)
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {applicationCardsState.map(
          (applicationCard: ApplicationResponseDto) => (
            <ApplicationCard
              applicationCard={applicationCard}
              key={applicationCard.id}
            />
          ),
        )}
      </div>
    );

  return (
    <div className="text-muted-foreground flex w-full flex-1 flex-col items-center justify-center gap-4">
      <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
        <Plus className="h-8 w-8" />
      </div>
      <p className="text-lg font-medium">No Applications yet</p>
      <p className="text-sm">
        Get started by adding your first job application
      </p>
      <AddApplicationButton />
    </div>
  );
}
