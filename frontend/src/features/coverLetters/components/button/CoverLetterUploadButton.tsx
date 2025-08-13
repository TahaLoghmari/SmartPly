import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, FileText } from "lucide-react";
import { useUploadCoverLetter } from "#/coverLetters";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function CoverLetterUploadButton() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const uploadCoverLetterMutation = useUploadCoverLetter();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <Upload className="h-4 w-4" />
          <p>Upload a cover letter</p>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[90vh] overflow-auto sm:max-w-lg"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
              <FileText className="text-muted-foreground h-4 w-4" />
            </div>
            <p className="text-secondary-foreground text-lg leading-6 font-medium">
              Upload Cover Letter
            </p>
          </DialogTitle>
        </DialogHeader>
        <label className="mb-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-[#d7d8db] px-2 py-6 tracking-wide">
          <div className="bg-muted mx-auto flex h-12 w-12 items-center justify-center rounded-full">
            <Upload className="text-muted-foreground h-6 w-6" />
          </div>
          <p className="text-primary text-sm font-medium transition duration-150 ease-in-out focus:underline focus:outline-none">
            {!file
              ? "Please upload a cover letter"
              : `${file.name} is ready to be uploaded`}
          </p>
          <p className="text-muted-foreground text-xs font-medium">
            PDF, DOC, DOCX up to 5 MB
          </p>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <DialogFooter className="sm:justify-center">
          <Button
            className="w-44"
            disabled={!file}
            onClick={() => {
              if (!file) return;
              uploadCoverLetterMutation.mutate(
                {
                  name: file.name.replace(/\.[^/.]+$/, ""),
                  file: file,
                },
                {
                  onSuccess: () => setOpen(false),
                },
              );
            }}
          >
            {uploadCoverLetterMutation.isPending ? (
              <Spinner className="h-5 w-5 border-2 invert" />
            ) : (
              "Upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
