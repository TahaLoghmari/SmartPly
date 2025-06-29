import { Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import { useSideBarState } from "../../../dashboard";

export function SideBarLogo() {
  const { activeState, setActiveState } = useSideBarState();
  return (
    <div
      className={`flex items-center border-b border-gray-200 p-2 transition-all duration-300 ${!activeState ? "justify-center" : "justify-between"}`}
    >
      {activeState && (
        <div className="flex items-center gap-2">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-primary font-bold">SmartPly</p>
            <p className="text-muted-foreground text-xs whitespace-nowrap">
              Smart Job Hunting
            </p>
          </div>
        </div>
      )}
      <button
        className="flex cursor-pointer items-center justify-center rounded-md p-2 transition-all duration-300 hover:bg-[#f1f4f8]"
        onClick={() => setActiveState(!activeState)}
      >
        <div className="relative h-4 w-4">
          <ChevronLeft
            className={`absolute inset-0 h-4 w-4 transition-opacity duration-300 ${
              activeState ? "opacity-100" : "opacity-0"
            }`}
          />
          <ChevronRight
            className={`absolute inset-0 h-4 w-4 transition-opacity duration-300 ${
              activeState ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>
      </button>
    </div>
  );
}
