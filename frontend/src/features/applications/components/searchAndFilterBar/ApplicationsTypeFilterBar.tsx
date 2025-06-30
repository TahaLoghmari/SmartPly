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
  useApplicationsTypeFilterStore,
  applicationsType,
} from "#/applications";

export function ApplicationsTypeFilterBar() {
  const {
    isTypeFilterOpen,
    selectedTypeFilter,
    setIsTypeFilterOpen,
    setSelectedFilterType,
  } = useApplicationsTypeFilterStore();
  return (
    <Popover open={isTypeFilterOpen} onOpenChange={setIsTypeFilterOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={isTypeFilterOpen}
          className="w-[200px] justify-between border font-normal"
        >
          {selectedTypeFilter
            ? applicationsType.find((type) => type.value === selectedTypeFilter)
                ?.label
            : "Type"}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Type..." />
          <CommandList>
            <CommandEmpty>No Type found.</CommandEmpty>
            <CommandGroup>
              {applicationsType.map((type) => (
                <CommandItem
                  key={type.value}
                  value={type.value}
                  onSelect={(currentValue) => {
                    setSelectedFilterType(currentValue);
                    setIsTypeFilterOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedTypeFilter === type.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {type.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
