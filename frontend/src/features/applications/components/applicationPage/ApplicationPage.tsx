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
  applicationsStatusOptionsConstant,
} from "#/applications";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      setTimeout(() => {
        navigate("/app/applications");
      }, 300);
    }
  };
  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="gap-0 sm:max-w-7xl">
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
                setTimeout(() => {
                  navigate("/app/applications");
                }, 300);
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
            <div className="flex">
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
              <div className="flex flex-1 flex-col border-l px-8 py-6">
                <div className="bg-card flex w-full flex-col gap-6 rounded-lg border p-4 shadow-xs">
                  <p className="font-medium">Application Status</p>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder="Status"
                        className="text-primary placeholder:text-primary text-sm"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {applicationsStatusOptionsConstant.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
