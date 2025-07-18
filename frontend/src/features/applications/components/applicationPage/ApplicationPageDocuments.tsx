import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
// Update this later
import { useGetUserResumes, coverLettersConstant } from "#/documents";
import { type ApplicationPageProps } from "#/applications";

export function ApplicationPageDocuments({
  applicationCard,
}: ApplicationPageProps) {
  const { data: resumes } = useGetUserResumes();
  const resumesConstant = resumes ?? [];
  const resumeUsed = resumesConstant.find(
    (r) => r.id == applicationCard.resumeId,
  );
  const coverLetterUser = coverLettersConstant.find(
    (c) => c.id == applicationCard.coverLetterId,
  );
  return (
    <div className="bg-card text-card-foreground flex min-w-70 flex-col gap-5 rounded-lg border p-6">
      <p className="text-2xl leading-none font-semibold tracking-tight">
        Documents
      </p>
      <div className="flex flex-col gap-3 pt-2">
        <Link to={`/documents/${resumeUsed?.id}`}>
          <Button
            variant="outline"
            className="w-full cursor-pointer justify-start"
          >
            <ExternalLink className="h-4 w-4" />
            {resumeUsed?.name}
          </Button>
        </Link>
        <Link to={`/documents/${coverLetterUser?.id}`}>
          <Button
            variant="outline"
            className="w-full cursor-pointer justify-start"
          >
            <ExternalLink className="h-4 w-4" />
            {coverLetterUser?.name}
          </Button>
        </Link>
      </div>
    </div>
  );
}
