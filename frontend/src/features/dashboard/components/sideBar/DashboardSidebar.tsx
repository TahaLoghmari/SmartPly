import {
  DashboardSidebarContent,
  useDashboardInboxStateStore,
  useDashboardInboxTypeStore,
  useDashboardOverallSidebarState,
} from "#/dashboard";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Inbox, useSyncUserEmails } from "#/inbox";
import { useCurrentScreenSize } from "@/hooks";
import { RotateCcw } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardSidebar() {
  const { isInboxOpen } = useDashboardInboxStateStore();
  const isInboxRoute = location.pathname.includes("inbox");
  const { isOverallSidebarOpen, setIsOverallSidebarOpen } =
    useDashboardOverallSidebarState();
  const { currentScreenSize } = useCurrentScreenSize();
  const { inboxType, setInboxType } = useDashboardInboxTypeStore();
  const syncUserEmailsMutation = useSyncUserEmails();
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
                    <div className="flex items-center justify-between border-b">
                      <div
                        className="text-foreground flex gap-4 p-4 pb-0 text-sm font-medium"
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
                      {syncUserEmailsMutation.isPending ? (
                        <Spinner className="mr-5 h-4 w-4 border-2" />
                      ) : (
                        <RotateCcw
                          className="hover:text-muted-foreground mr-5 h-4 w-4 cursor-pointer"
                          onClick={() => syncUserEmailsMutation.mutate()}
                        />
                      )}
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
                  <div className="flex items-center justify-between border-b">
                    <div
                      className="text-foreground flex gap-4 p-4 pb-0 text-sm font-medium"
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
                    {syncUserEmailsMutation.isPending ? (
                      <Spinner className="mr-5 h-4 w-4 border-2" />
                    ) : (
                      <RotateCcw
                        className="hover:text-muted-foreground mr-5 h-4 w-4 cursor-pointer"
                        onClick={() => syncUserEmailsMutation.mutate()}
                      />
                    )}
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
