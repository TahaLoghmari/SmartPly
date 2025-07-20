import {
  DashboardSideBar,
  DashboardHeader,
} from "#/dashboard";
import { useSearchParams, Outlet } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "#/auth";

export function Dashboard() {
  const { isLoading } = useCurrentUser();
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      toast.error(message);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner className="dark:invert" />
      </div>
    );
  return (
    <div className="bg-background flex h-screen">
      <DashboardSideBar />
      {/*  */}
      <div
        className={`flex flex-1 flex-col overflow-hidden transition-[width,height,margin,padding] duration-300`}
      >
        <DashboardHeader />
        <Outlet />
      </div>
    </div>
  );
}
