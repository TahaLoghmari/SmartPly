import {
  useDashboardActiveNavItemStore,
  dashboardSideBarNavigationComponentsConstant,
  DashboardSideBarLayout,
  DashboardHeaderLayout,
} from "#/dashboard";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";

export function DashboardLayout() {
  const { activeNavItemState } = useDashboardActiveNavItemStore();
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
