import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ApplicationPageOverviewSection,
  ApplicationPageTabs,
  ApplicationPageHeader,
  useApplicationPageNavigationStore,
  useGetUserApplication,
  ApplicationPageDocumentsSection,
  ApplicationPageStatus,
} from "#/applications";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";

export function ApplicationPage() {
  const { navigationPage } = useApplicationPageNavigationStore();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    data: applicationCard,
    isLoading,
    isError,
  } = useGetUserApplication({
    id: id ?? "",
  });
  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      navigate("/app/applications");
    }
  };
  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="gap-0 overflow-y-auto sm:max-w-7xl">
        {isLoading && (
          <div className="flex flex-1 flex-col items-center justify-center overflow-auto transition-[width,height,margin,padding] duration-300">
            <Spinner className="dark:invert" />
          </div>
        )}
        {(isError || !applicationCard) && (
          <div className="flex flex-1 flex-col items-center justify-center overflow-auto transition-[width,height,margin,padding] duration-300">
            <p>Application not found.</p>
            <Button
              variant="ghost"
              className="cursor-pointer"
              onClick={() => {
                setOpen(false);
                navigate("/app/applications");
              }}
              aria-label="Back to Applications"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Applications</span>
            </Button>
          </div>
        )}
        {!isLoading && !isError && applicationCard && (
          <>
            <ApplicationPageHeader applicationCard={applicationCard} />
            <div className="flex flex-1">
              <div className="flex flex-col">
                <ApplicationPageTabs />
                {navigationPage === "Overview" ? (
                  <ApplicationPageOverviewSection
                    applicationCard={applicationCard}
                  />
                ) : (
                  <ApplicationPageDocumentsSection />
                )}
              </div>
              {/* the right part */}
              <div className="flex w-1/3 flex-col gap-6 border-x px-8 py-6">
                <ApplicationPageStatus />
                <div className="flex w-full flex-col gap-2">
                  <p className="font-medium">Notes</p>
                  <div className="bg-accent text-accent-foreground rounded-md p-4 text-xs break-words">
                    {applicationCard.notes}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
