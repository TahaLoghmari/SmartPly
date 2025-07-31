import { ExternalLink } from "lucide-react";
import { useState } from "react";

export function ResumePreview({ url }: { url: string }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative flex w-full flex-1 p-4">
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
        </div>
      )}
      <iframe
        src={`${url}#toolbar=0&navpanes=0`}
        title="Resume Preview"
        className="w-full flex-1 border-0"
        onLoad={() => setLoading(false)}
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
