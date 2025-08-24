import {
  useDashboardSidebarStateStore,
  DashboardSidebarContent,
  useDashboardInboxStateStore,
} from "#/dashboard";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Inbox } from "#/inbox";
import { useCurrentScreenSize } from "@/hooks";

export default function DashboardSidebar() {
  const { isSidebarOpen, setIsSidebarOpen } = useDashboardSidebarStateStore();
  const { isInboxOpen } = useDashboardInboxStateStore();
  const isInboxRoute = location.pathname.includes("inbox");
  const { currentScreenSize } = useCurrentScreenSize();
  return (
    <>
      {currentScreenSize < 768 ? (
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent
            side="left"
            className={`flex ${isInboxRoute && currentScreenSize < 768 ? "w-fit gap-0 sm:max-w-full" : "w-[287px]"} flex-row focus:outline-none`}
          >
            <DashboardSidebarContent
              className={`${isInboxRoute ? "bg-sidebar border-r" : ""} `}
            />
            {isInboxRoute && (
              <div
                className={`bg-sidebar ${isInboxOpen ? "h-svh w-[307px]" : "w-0"} flex flex-col transition-all duration-200`}
              >
                {isInboxOpen && (
                  <>
                    <div className="text-foreground border-b p-4 pb-[7px] text-base font-medium">
                      Inbox
                    </div>
                    <div className="overflow-auto p-0">
                      <Inbox />
                    </div>
                  </>
                )}
              </div>
            )}
          </SheetContent>
        </Sheet>
      ) : (
        <>
          <DashboardSidebarContent className="border-r" />
          {isInboxRoute && (
            <div
              className={`bg-sidebar ${isInboxOpen ? "h-svh w-[307px] border-r" : "w-0"} flex flex-col transition-all duration-200`}
            >
              {isInboxOpen && (
                <>
                  <div className="text-foreground border-b p-4 pb-[7px] text-base font-medium">
                    Inbox
                  </div>
                  <div className="overflow-auto p-0">
                    <Inbox />
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
