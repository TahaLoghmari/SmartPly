import {
  usePatchApplication,
  useUpdateApplicationStatus,
  type ApplicationsPageStatusDateProps,
} from "#/applications";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { type JsonPatchDto } from "@/types";

export default function ApplicationPageStatusDate({
  applicationStatusDate,
  step,
  selected,
  applicationCard,
  id,
}: ApplicationsPageStatusDateProps) {
  // selected prop is for knowing wether this current step is selected or not ( after current state or not )
  // we need to know that in order to update the current status to current step when the current's step
  // date is updated, since it's updated and it's not selected then select it
  const [open, setOpen] = useState<boolean>(false);
  const patchApplicationMutation = usePatchApplication();
  const { updateApplicationStatus } =
    useUpdateApplicationStatus(applicationCard);
  return (
    <>
      <p className="flex items-center font-medium">
        {step}
        <span className="text-muted-foreground ml-2 flex items-center text-xs font-normal">
          {applicationStatusDate
            ? `${applicationStatusDate.getDate()}/${applicationStatusDate.getMonth() + 1}/${applicationStatusDate.getFullYear() % 100}`
            : ""}
        </span>
      </p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            fill="currentColor"
            className="text-muted-foreground h-3 w-3 cursor-pointer"
          >
            <path d="M120-120v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm584-528 56-56-56-56-56 56 56 56Z" />
          </svg>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            required
            defaultMonth={
              applicationStatusDate ? applicationStatusDate : new Date()
            }
            selected={
              applicationStatusDate ? applicationStatusDate : new Date()
            }
            onSelect={(selectedDate) => {
              if (!selectedDate) return;
              const patchRequest: JsonPatchDto[] = [
                {
                  op: "replace",
                  path: `/${step[0].toLowerCase() + step.slice(1)}Date`,
                  value: selectedDate.toISOString(),
                },
              ];
              patchApplicationMutation.mutate(
                { id, patch: patchRequest },
                {
                  onSuccess: () => {
                    setOpen(false);
                  },
                },
              );
              if (selected) updateApplicationStatus(step);
            }}
            className="rounded-lg border shadow-sm"
          />
        </PopoverContent>
      </Popover>
    </>
  );
}
