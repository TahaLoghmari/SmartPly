import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetUserApplication } from "#/applications";

export function ApplicationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id: string = searchParams.get("id") || "";
  const { data, isLoading } = useGetUserApplication({ id });
  console.log(data);
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center overflow-auto transition-all duration-300">
        <Spinner className="dark:invert" />
      </div>
    );
  }
  return (
    <div className="flex flex-1 flex-col items-center gap-6 overflow-auto transition-all duration-300">
      <div className="w-[65%] p-6">
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Applications</span>
        </Button>
        <div className="flex flex-col gap-4">
          {/* the one on the top left with Quick Info */}
          <div className="flex gap-4">
            {/* the one on the top left */}
            <div className="bg-card text-card-foreground flex-1 rounded-lg border p-6"></div>
            {/* Quick Info */}
            <div className="bg-card text-card-foreground rounded-lg border p-6">
              <p className="text-2xl leading-none font-semibold tracking-tight">
                Quick Info
              </p>
            </div>
          </div>
          {/* Job Description with Actions */}
          <div>
            {/* Job Description */}
            <div></div>
            {/* Actions */}
            <div></div>
          </div>
          {/* Application TimeLine with Documents and Notes */}
          <div>
            {/* Application Timeline */}
            <div></div>
            {/* Documents and Notes */}
            <div>
              {/* Documents */}
              <div></div>
              {/* Notes */}
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
