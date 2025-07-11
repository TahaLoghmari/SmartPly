import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetUserApplication,
  QuickInfo,
  ApplicationPageHeader,
  JobDescription,
  Actions,
  ApplicationPageDocuments,
} from "#/applications";

export function ApplicationPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: applicationCard, isLoading } = useGetUserApplication({
    id: id ?? "",
  });
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center overflow-auto transition-all duration-300">
        <Spinner className="dark:invert" />
      </div>
    );
  }
  if (!applicationCard) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center overflow-auto transition-all duration-300">
        <p>Application not found.</p>
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Applications</span>
        </Button>
      </div>
    );
  }
  return (
    <div className="flex flex-1 flex-col items-center gap-6 overflow-auto transition-all duration-300">
      <div className="w-[70%] p-6">
        <Button
          variant="ghost"
          className="mb-2 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Applications</span>
        </Button>
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-4">
            <ApplicationPageHeader applicationCard={applicationCard} />
            <JobDescription jobDescription={applicationCard.jobDescription} />
          </div>
          <div className="flex max-w-80 min-w-75 flex-col gap-4">
            <QuickInfo applicationCard={applicationCard} />
            <Actions applicationCard={applicationCard} />
            <ApplicationPageDocuments applicationCard={applicationCard} />
          </div>
        </div>
      </div>
    </div>
  );
}
