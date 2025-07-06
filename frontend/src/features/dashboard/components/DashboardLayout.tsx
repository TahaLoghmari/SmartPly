import {
  useDashboardActiveNavItemStore,
  dashboardSideBarNavigationComponentsConstant,
  DashboardSideBarLayout,
  DashboardHeaderLayout,
} from "#/dashboard";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "#/auth";

export function DashboardLayout() {
  const { activeNavItemState } = useDashboardActiveNavItemStore();
  const { isLoading } = useCurrentUser();
  const ActiveComponent =
    dashboardSideBarNavigationComponentsConstant[activeNavItemState];
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
      <DashboardSideBarLayout />
      <div
        className={`flex flex-1 flex-col overflow-hidden transition-all duration-300`}
      >
        <DashboardHeaderLayout />
        <ActiveComponent />
      </div>
    </div>
  );
}
