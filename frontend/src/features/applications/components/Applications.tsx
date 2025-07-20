import {
  ApplicationStats,
  ApplicationFilters,
  ApplicationCards,
} from "#/applications";
import { AddApplicationButton } from "#/dashboard";
import { Outlet } from "react-router-dom";

export function Applications() {
  return (
    <div className="flex-1 overflow-auto transition-[width,height,margin,padding] duration-300">
      <div className="flex w-full flex-col gap-6 p-6 px-20">
        <div className="flex items-center justify-between">
          <div className="mb-5 flex flex-col">
            <p className="text-3xl font-bold tracking-tight">
              Job Applications
            </p>
            <p className="text-muted-foreground mt-1">
              Track and manage your job applications
            </p>
          </div>
          <AddApplicationButton />
        </div>
        <ApplicationStats />
        <ApplicationFilters />
        <ApplicationCards />
        <Outlet />
      </div>
    </div>
  );
}
