import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { dashboardNavigationTitlesConstant } from "#/dashboard/constants";
import { useDashboardTitleStore } from "#/dashboard";

export function useSyncDashboardTitle() {
  const location = useLocation();
  const { setDashboardTitleState } = useDashboardTitleStore();

  useEffect(() => {
    const section = location.pathname.split("/")[2] || "applications";
    const title = dashboardNavigationTitlesConstant[section] || "Dashboard";
    setDashboardTitleState(title);
  }, [location.pathname, setDashboardTitleState]);
}
