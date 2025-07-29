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
} from "#/applications";
import { type JsonPatchOp } from "@/types";
import { handleApiError } from "@/index";

export function ApplicationsStatusControl({
  applicationCard,
  className = "",
}: {
  applicationCard: ApplicationResponseDto;
  className?: string;
}) {
  const patchApplicationMutation = usePatchApplication();

  const stepsWithLastStatus = [...steps, "Offer", "Rejected", "Ghosted"];

  const handleValueChange = (newStatus: string) => {
    const newStatus_UpperCase = newStatus[0].toUpperCase() + newStatus.slice(1);
    const patchRequest: JsonPatchOp[] = [
      {
        op: "replace",
        path: "/status",
        value: newStatus,
      },
      ...stepsWithLastStatus
        .filter(
          (step) => statusToValue[step] > statusToValue[newStatus_UpperCase],
        )
        .map((step) => ({
          op: "replace" as const,
          path: `/${step[0].toLowerCase() + step.slice(1)}Date`,
          value: null,
        })),
      ...stepsWithLastStatus
        .filter(
          (step) => statusToValue[step] <= statusToValue[newStatus_UpperCase],
        )
        .map((step) => ({
          op: "replace" as const,
          path: `/${step[0].toLowerCase() + step.slice(1)}Date`,
          value: new Date().toISOString(),
        })),
    ];
    patchApplicationMutation.mutate(
      {
        id: applicationCard.id,
        patch: patchRequest,
      },
      {
        onError: (error) => handleApiError(error),
      },
    );
  };

  return (
    <Select
      defaultValue={applicationCard.status}
      onValueChange={handleValueChange}
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
