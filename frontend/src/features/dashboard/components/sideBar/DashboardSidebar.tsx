import {
  DashboardSidebarContent,
  useDashboardInboxStateStore,
  useDashboardInboxTypeStore,
  useDashboardOverallSidebarState,
} from "#/dashboard";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Inbox } from "#/inbox";
import { useCurrentScreenSize } from "@/hooks";

export default function DashboardSidebar() {
  const { isInboxOpen } = useDashboardInboxStateStore();
  const isInboxRoute = location.pathname.includes("inbox");
  const { isOverallSidebarOpen, setIsOverallSidebarOpen } =
    useDashboardOverallSidebarState();
  const { currentScreenSize } = useCurrentScreenSize();
  const { inboxType, setInboxType } = useDashboardInboxTypeStore();
  return (
    <>
      {currentScreenSize < 768 ? (
        <Sheet
          open={isOverallSidebarOpen}
          onOpenChange={setIsOverallSidebarOpen}
        >
          <SheetContent
            side="left"
            className={`flex ${isInboxRoute && currentScreenSize < 768 ? "w-fit flex-row gap-0 sm:max-w-full" : "w-[287px]"} focus:outline-none`}
          >
            <DashboardSidebarContent
              className={`${isInboxRoute ? "bg-sidebar flex-1 border-r" : ""} `}
            />
            {isInboxRoute && (
              <div
                className={`bg-sidebar ${isInboxOpen ? "h-svh w-[300px]" : "w-0"} flex flex-col transition-all duration-200`}
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
                  <div
                    className="text-foreground flex gap-4 border-b p-4 pb-0 text-sm font-medium"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <p
                      className={`w-fit cursor-pointer pb-[9px] transition-all duration-200 ${inboxType === "Inbox" && "border-primary border-b-2"}`}
                      onClick={() => setInboxType("Inbox")}
                    >
                      Inbox
                    </p>
                    <p
                      className={`w-fit cursor-pointer pb-[9px] transition-all duration-200 ${inboxType === "Job Inbox" && "border-primary border-b-2"}`}
                      onClick={() => setInboxType("Job Inbox")}
                    >
                      Job Inbox
                    </p>
                  </div>
                  <div className="overflow-auto p-0">
                    {inboxType === "Inbox" ? (
                      <Inbox jobRelated={false} />
                    ) : (
                      <Inbox jobRelated={true} />
                    )}
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
