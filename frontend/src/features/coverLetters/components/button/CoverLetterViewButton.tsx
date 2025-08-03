import { CoverLetterPreview } from "#/coverLetters";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FileText } from "lucide-react";

export default function CoverLetterViewButton({ url }: { url: string }) {
  return (
    <Dialog>
      <DialogTrigger>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          fill="currentColor"
          className="text-muted-foreground hover:text-primary flex h-[18px] w-[18px] cursor-pointer items-center justify-center"
        >
          <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
        </svg>
      </DialogTrigger>
      <DialogContent className="flex h-[90vh] min-w-292 flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
            <FileText className="text-muted-foreground h-4 w-4" />
          </div>
          <div>
            <p className="text-secondary-foreground text-lg leading-6 font-medium">
              Cover Letter Preview
            </p>
            <p className="text-muted-foreground text-sm">
              If the preview doesn't appear, close and reopen the popup. If the
              issue persists{" "}
              <a
                href={url}
                target="_blank"
                className="text-secondary-foreground hover:text-primary relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-transparent p-0 text-sm/4 font-medium transition-colors duration-200 ease-in-out"
              >
                click here
              </a>
              .
            </p>
          </div>
        </div>
        <CoverLetterPreview url={url} />
      </DialogContent>
    </Dialog>
  );
}
