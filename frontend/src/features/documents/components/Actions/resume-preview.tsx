import { ExternalLink } from "lucide-react";

export function ResumePreview({ url }: { url: string }) {
  return (
    <div className="relative flex w-full flex-1 p-4">
      <iframe
        src={`${url}#toolbar=0&navpanes=0`}
        title="Resume Preview"
        className="w-full flex-1 border-0"
      />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-8 right-12 z-10 flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white transition-colors hover:bg-gray-800"
      >
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
}
