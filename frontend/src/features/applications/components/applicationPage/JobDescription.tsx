import ReactMarkdown from "react-markdown";

export function JobDescription({
  jobDescription,
}: {
  jobDescription: string | null;
}) {
  return (
    <div className="bg-card text-card-foreground flex flex-1 flex-col gap-3 rounded-lg border p-6">
      <p className="text-2xl leading-none font-semibold tracking-tight">
        Job Description
      </p>
      <div className="prose max-w-none">
        <ReactMarkdown>{jobDescription}</ReactMarkdown>
      </div>
    </div>
  );
}
