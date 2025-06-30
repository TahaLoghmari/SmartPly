import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  useApplicationsStatusFilterStore,
  applicationsStatus,
} from "#/applications";

export function ApplicationsStatusFilterBar() {
  const {
    isStatusFilterOpen,
    selectedStatusFilter,
    setIsStatusFilterOpen,
    setSelectedFilterStatus,
  } = useApplicationsStatusFilterStore();
  return (
    <Popover open={isStatusFilterOpen} onOpenChange={setIsStatusFilterOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={isStatusFilterOpen}
          className="w-[200px] justify-between border font-normal"
        >
          {selectedStatusFilter
            ? applicationsStatus.find(
                (status) => status.value === selectedStatusFilter,
              )?.label
            : "Status"}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Status..." />
          <CommandList>
            <CommandEmpty>No Status found.</CommandEmpty>
            <CommandGroup>
              {applicationsStatus.map((status) => (
                <CommandItem
                  key={status.value}
                  value={status.value}
                  onSelect={(currentValue) => {
                    setSelectedFilterStatus(currentValue);
                    setIsStatusFilterOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedStatusFilter === status.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {status.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
