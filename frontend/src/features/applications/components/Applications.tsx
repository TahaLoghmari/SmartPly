import {
  ApplicationAddButton,
  ApplicationsFilters,
  ApplicationsCards,
  useGetUserApplications,
} from "#/applications";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Link, Outlet } from "react-router-dom";

export function Applications() {
  const { isError, isPending, data } = useGetUserApplications();

  return (
    <div className="flex w-full flex-1 flex-col items-center overflow-auto transition-[width,height,margin,padding] duration-300">
      <div className="mb-4 flex w-[94%] flex-1 flex-col pt-8 xl:w-[90%]">
        <div className="flex flex-col">
          <p className="text-3xl font-bold tracking-tight">Job Applications</p>
        </div>
        <div className="mb-4 flex items-center justify-between border-b pb-4">
          <p className="text-muted-foreground pt-2 pl-1 text-base font-bold uppercase">
            {data?.pages?.[0].totalCount} TOTAL JOBS
          </p>
          <ApplicationAddButton />
        </div>
        <ApplicationsFilters />
        {isPending && (
          <div className="flex w-full flex-1 flex-col items-center justify-center">
            <Spinner />
          </div>
        )}
        {isError && (
          <div className="text-muted-foreground mt-26 flex w-full flex-1 flex-col items-center justify-center gap-7">
            <div className="flex flex-col items-center justify-center gap-2">
              <p className="text-primary text-4xl font-medium">
                An Error Occured
              </p>
              <p className="text-sm">Please refresh the page</p>
            </div>
            <Button>
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        )}
        {!isPending && !isError && <ApplicationsCards />}
        <Outlet />
      </div>
    </div>
  );
}
