import { BriefcaseBusiness, X, ArrowLeft } from "lucide-react";
import {
  ApplicationEditButton,
  ApplicationDeleteButton,
  useDeleteApplication,
  type ApplicationResponseDto,
} from "#/applications";
import { useCurrentScreenSize } from "@/index";

export default function ApplicationPageHeader({
  applicationCard,
  handleClose,
}: {
  applicationCard: ApplicationResponseDto;
  handleClose: (state: boolean) => void;
}) {
  const deleteMutation = useDeleteApplication();
  const { currentScreenSize } = useCurrentScreenSize();
  return (
    <div className="flex flex-col gap-4 border-b px-8 py-6 lg:flex-row lg:items-center lg:justify-between">
      {currentScreenSize < 1024 && (
        <div className="flex items-center justify-between">
          <span
            className="text-strong-muted-foreground flex items-center gap-1 text-xs font-semibold"
            onClick={() => handleClose(false)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </span>
          <div className="flex items-center justify-end gap-4">
            <ApplicationEditButton applicationCard={applicationCard} />
            <ApplicationDeleteButton
              onDelete={() => deleteMutation.mutate(applicationCard.id)}
              isLoading={deleteMutation.isPending}
            />
          </div>
        </div>
      )}
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
      {currentScreenSize >= 1024 && (
        <div className="flex items-center justify-end gap-4">
          <ApplicationEditButton applicationCard={applicationCard} />
          <ApplicationDeleteButton
            onDelete={() => deleteMutation.mutate(applicationCard.id)}
            isLoading={deleteMutation.isPending}
          />
          <X
            className="h-5 w-5 cursor-pointer"
            onClick={() => handleClose(false)}
          />
        </div>
      )}
    </div>
  );
}
