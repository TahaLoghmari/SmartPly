import { useEffect, useState } from "react";

export function useCurrentScreenSize() {
  const [currentScreenSize, setCurrenScreenSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setCurrenScreenSize(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { currentScreenSize };
}
