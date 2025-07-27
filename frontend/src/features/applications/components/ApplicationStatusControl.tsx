import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  applicationsStatusOptionsConstant,
  statusToValue,
  steps,
  usePatchApplication,
  type ApplicationResponseDto,
  type JsonPatchOp,
} from "#/applications";
import { useEffect, useState } from "react";

export function ApplicationStatusControl({
  applicationCard,
  className = "",
}: {
  applicationCard: ApplicationResponseDto;
  className?: string;
}) {
  const patchApplicationMutation = usePatchApplication();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (patchApplicationMutation.isSuccess && !patchApplicationMutation.isError)
      setOpen(false);
  }, [patchApplicationMutation.isPending]);

  const stepsWithLastStatus = [...steps, "Offer", "Rejected", "Ghosted"];

  return (
    <Select
      open={open}
      onOpenChange={(nextOpen) => {
        if (
          patchApplicationMutation.isSuccess &&
          !nextOpen &&
          !patchApplicationMutation.isError
        )
          setOpen(nextOpen);
        if (nextOpen) setOpen(nextOpen);
      }}
      defaultValue={applicationCard.status}
      onValueChange={(newStatus) => {
        const newStatus_UpperCase =
          newStatus[0].toUpperCase() + newStatus.slice(1);
        const patchRequest: JsonPatchOp[] = [
          {
            op: "replace",
            path: "/status",
            value: newStatus,
          },
          ...stepsWithLastStatus
            .filter(
              (step) =>
                statusToValue[step] > statusToValue[newStatus_UpperCase],
            )
            .map((step) => ({
              op: "replace" as const,
              path: `/${step[0].toLowerCase() + step.slice(1)}Date`,
              value: null,
            })),
          ...stepsWithLastStatus
            .filter(
              (step) =>
                statusToValue[step] <= statusToValue[newStatus_UpperCase],
            )
            .map((step) => ({
              op: "replace" as const,
              path: `/${step[0].toLowerCase() + step.slice(1)}Date`,
              value: new Date().toISOString(),
            })),
        ];
        patchApplicationMutation.mutate({
          id: applicationCard.id,
          patch: patchRequest,
        });
      }}
    >
      <SelectTrigger className={`cursor-pointer ${className}`}>
        <SelectValue
          placeholder="Status"
          className="text-primary placeholder:text-primary text-sm"
        />
      </SelectTrigger>
      <SelectContent>
        {applicationsStatusOptionsConstant.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
