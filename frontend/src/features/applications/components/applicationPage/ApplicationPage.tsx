import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, BriefcaseBusiness } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  applicationsJobTypeOptionsConstant,
  applicationsLevelOptionsConstant,
  applicationsStatusOptionsConstant,
  applicationsTypeOptionsConstant,
  DeleteApplicationButton,
  EditApplicationButton,
  TechnologiesUsed,
  useGetUserApplication,
  type ApplicationJobTypeLabel,
  type ApplicationLevelLabel,
  type ApplicationStatusLabel,
  type ApplicationTypeLabel,
} from "#/applications";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";

export function ApplicationPage() {
  const [navigationPage, setNavigationPage] = useState("Overview");
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const { id } = useParams();
  const { data: applicationCard, isLoading } = useGetUserApplication({
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
  if (isLoading) {
    return (
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent>
          <Spinner className="dark:invert" />
        </SheetContent>
      </Sheet>
    );
  }
  if (!applicationCard) {
    return (
      <Sheet open={open} onOpenChange={handleClose}>
        <SheetContent>
          <div className="flex flex-1 flex-col items-center justify-center overflow-auto transition-[width,height,margin,padding] duration-300">
            <p>Application not found.</p>
            <Button
              variant="ghost"
              className="cursor-pointer"
              onClick={() => navigate(-1)}
              aria-label="Back to Applications"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Applications</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  const status: ApplicationStatusLabel = applicationsStatusOptionsConstant.find(
    (a) => a.value === applicationCard.status,
  )!.label;
  const type: ApplicationTypeLabel = applicationsTypeOptionsConstant.find(
    (a) => a.value === applicationCard.type,
  )!.label;
  const jobType: ApplicationJobTypeLabel =
    applicationsJobTypeOptionsConstant.find(
      (a) => a.value === applicationCard.jobType,
    )!.label;
  const level: ApplicationLevelLabel = applicationsLevelOptionsConstant.find(
    (a) => a.value === applicationCard.level,
  )!.label;
  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="gap-0 sm:max-w-7xl">
        {/* the Header */}
        <div className="flex items-center justify-between border-b px-8 py-6">
          <div className="flex flex-1 items-center gap-4">
            <div className="rounded-sm bg-gradient-to-r from-gray-500 to-gray-400 p-3 text-white">
              <BriefcaseBusiness className="h-8 w-8" />
            </div>
            <div className="flex flex-1 flex-col justify-center gap-1">
              <p className="text-base leading-5 font-medium">
                {applicationCard.position}
              </p>
              <div className="text-muted-foreground flex items-center gap-1 truncate text-sm leading-5">
                <p>{applicationCard.companyName}</p>
              </div>
              <div className="flex items-center gap-1 truncate text-sm leading-5">
                <p>{applicationCard.companyEmail}</p>
              </div>
            </div>
          </div>
          <div className="mr-6 flex items-center gap-4">
            <EditApplicationButton applicationCard={applicationCard} />
            <DeleteApplicationButton applicationCard={applicationCard} />
          </div>
        </div>
        {/* the Content */}
        <div>
          {/* the left part */}
          <div className="flex flex-col">
            {/* the navigation parts */}
            <div className="flex flex-1 items-center gap-4 border-b px-8 py-2">
              <div
                onClick={() => setNavigationPage("Overview")}
                className={`${navigationPage === "Overview" ? "bg-accent text-accent-foreground" : ""} flex w-fit items-center gap-2 rounded-md px-4 py-2 text-sm`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  className="h-4 w-4"
                  fill="currentColor"
                >
                  <path d="M160-120q-33 0-56.5-23.5T80-200v-440q0-33 23.5-56.5T160-720h160v-80q0-33 23.5-56.5T400-880h160q33 0 56.5 23.5T640-800v80h160q33 0 56.5 23.5T880-640v440q0 33-23.5 56.5T800-120H160Zm240-600h160v-80H400v80Z" />
                </svg>
                <p>Overview</p>
              </div>
              <div
                onClick={() => setNavigationPage("Documents")}
                className={`${navigationPage === "Documents" ? "bg-accent text-accent-foreground" : ""} flex w-fit items-center gap-2 rounded-md px-4 py-2 text-sm`}
              >
                <FontAwesomeIcon icon={faFile} />
                <p>Documents</p>
              </div>
            </div>
            {/* Job Posting and Documents part depending on navigationPage*/}
            {navigationPage === "Overview" && (
              <div className="flex flex-col gap-6 px-8 py-6">
                <p className="text-lg font-medium">Job Posting</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground text-sm">Location</p>
                    <p className="text-sm">{applicationCard.location}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground text-sm">Job Type</p>
                    <p className="text-sm">{jobType}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground text-sm">Type</p>
                    <p className="text-sm">{type}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground text-sm">Level</p>
                    <p className="text-sm">{level}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground text-sm">URL</p>
                    <p className="text-sm">{applicationCard.link}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground text-sm">Deadline</p>
                    <p className="text-sm">
                      {applicationCard.deadline &&
                        applicationCard.deadline
                          .toLocaleDateString("en-GB")
                          .replace(/\//g, "-")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground text-sm">Created</p>
                    <p className="text-sm">
                      {applicationCard.createdAt &&
                        applicationCard.createdAt
                          .toLocaleDateString("en-GB")
                          .replace(/\//g, "-")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground text-sm">Last Update</p>
                    <p className="text-sm">
                      {applicationCard.updatedAt &&
                        formatDistanceToNow(applicationCard.updatedAt, {
                          addSuffix: true,
                        })}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground text-sm">
                      Technologies
                    </p>
                    <TechnologiesUsed
                      className="p-1.5"
                      technologies={applicationCard.technologiesUsed || []}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground text-sm">Salary</p>
                    <div className="flex items-center gap-2">
                      {applicationCard.startSalary &&
                      applicationCard.endSalary ? (
                        <>
                          <p className="text-sm font-normal">
                            ${applicationCard.startSalary}k - $
                            {applicationCard.endSalary}k
                          </p>
                          <span className="bg-accent text-accent-foreground rounded-full p-1.5 px-3 text-xs font-normal">
                            /yr
                          </span>
                        </>
                      ) : (
                        <p className="text-sm font-normal">Not specified</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground text-sm">Description</p>
                    <div className="prose max-w-none text-sm">
                      <ReactMarkdown>
                        {applicationCard.jobDescription}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* the right part */}
          <div></div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
