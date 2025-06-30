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

interface ApplicationsTypeFilterBarProps {
  isFilterOpen: boolean;
  selectedFilter: string;
  setIsFilterOpen: (open: boolean) => void;
  setSelectedFilter: (value: string) => void;
  applicationConstant: Array<{ value: string; label: string }>;
  name: string;
}

export function ApplicationsFilterBar({
  isFilterOpen,
  selectedFilter,
  setIsFilterOpen,
  setSelectedFilter,
  applicationConstant,
  name,
}: ApplicationsTypeFilterBarProps) {
  return (
    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={isFilterOpen}
          className="w-[200px] justify-between border font-normal"
        >
          {selectedFilter
            ? applicationConstant.find((item) => item.value === selectedFilter)
                ?.label
            : name}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${name}...`} />
          <CommandList>
            <CommandEmpty>No {name} found.</CommandEmpty>
            <CommandGroup>
              {applicationConstant.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setSelectedFilter(currentValue);
                    setIsFilterOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedFilter === item.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
