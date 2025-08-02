import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ApplicationPageOverview,
  ApplicationPageTabs,
  ApplicationPageHeader,
  useApplicationPageNavigationStore,
  useGetUserApplication,
  ApplicationPageDocuments,
  ApplicationPageStatus,
} from "#/applications";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useEffect, useRef, useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";

export default function Page() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const { navigationPage } = useApplicationPageNavigationStore();
  const {
    data: applicationCard,
    isLoading,
    isError,
  } = useGetUserApplication({
    id: id ?? "",
  });
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      closeTimeoutRef.current = setTimeout(() => {
        navigate("/app/applications");
      }, 500);
    }
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="gap-0 overflow-y-auto focus:outline-none sm:max-w-7xl">
        <VisuallyHidden>
          <DialogTitle>Application Details</DialogTitle>
          <DialogDescription>
            Detailed information about your application.
          </DialogDescription>
        </VisuallyHidden>
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
              <div className="flex flex-1 flex-col">
                <ApplicationPageTabs />
                {navigationPage === "Overview" ? (
                  <ApplicationPageOverview applicationCard={applicationCard} />
                ) : (
                  <ApplicationPageDocuments applicationCard={applicationCard} />
                )}
              </div>
              <div className="flex w-1/3 flex-col gap-6 border-x px-8 py-6">
                <ApplicationPageStatus applicationCard={applicationCard} />
                <div className="flex w-full flex-col gap-2">
                  <p className="font-medium">Notes</p>
                  <div className="bg-accent text-accent-foreground rounded-md p-4 text-xs break-words">
                    {applicationCard.notes || '"N/A"'}
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
