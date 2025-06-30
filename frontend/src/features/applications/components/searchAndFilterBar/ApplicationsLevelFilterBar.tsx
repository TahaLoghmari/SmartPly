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
  useApplicationsLevelFilterStore,
  applicationsLevel,
} from "#/applications";

export function ApplicationsLevelFilterBar() {
  const {
    isLevelFilterOpen,
    selectedLevelFilter,
    setIsLevelFilterOpen,
    setSelectedFilterLevel,
  } = useApplicationsLevelFilterStore();
  return (
    <Popover open={isLevelFilterOpen} onOpenChange={setIsLevelFilterOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={isLevelFilterOpen}
          className="w-[200px] justify-between border font-normal"
        >
          {selectedLevelFilter
            ? applicationsLevel.find(
                (level) => level.value === selectedLevelFilter,
              )?.label
            : "Level"}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Type..." />
          <CommandList>
            <CommandEmpty>No Type found.</CommandEmpty>
            <CommandGroup>
              {applicationsLevel.map((level) => (
                <CommandItem
                  key={level.value}
                  value={level.value}
                  onSelect={(currentValue) => {
                    setSelectedFilterLevel(currentValue);
                    setIsLevelFilterOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedLevelFilter === level.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {level.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
