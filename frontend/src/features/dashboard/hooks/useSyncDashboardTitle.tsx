import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDashboardTitleStore } from "#/dashboard";

export function useSyncDashboardTitle() {
  const location = useLocation();
  const { setDashboardTitleState } = useDashboardTitleStore();

  useEffect(() => {
    const section = location.pathname.split("/")[2] || "applications";
    const capitalizedSection =
      section.charAt(0).toUpperCase() + section.slice(1);
    const title = capitalizedSection;
    setDashboardTitleState(title);
  }, [location.pathname, setDashboardTitleState]);
}
