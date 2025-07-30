import {
  ApplicationsTechnologiesUsed,
  frameworks,
  type ApplicationFormContentProps,
} from "#/applications";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

export function ApplicationsFormTechnologies({
  form,
}: ApplicationFormContentProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-4">
      <p className="text-foreground border-b pb-2 text-lg font-medium">
        Technologies
      </p>
      <div className="space-y-3">
        <FormField
          control={form.control}
          name="technologiesUsed"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {field.value && field.value.length > 0 ? (
                        <ApplicationsTechnologiesUsed
                          technologies={field.value}
                          className="min-h-15"
                        />
                      ) : (
                        "Add framework..."
                      )}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search framework..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                          {frameworks.map((framework) => (
                            <CommandItem
                              key={framework.value}
                              value={framework.value}
                              onSelect={(currentValue) => {
                                const currentValues = Array.isArray(field.value)
                                  ? field.value
                                  : [];
                                const isSelected =
                                  currentValues.includes(currentValue);

                                if (isSelected) {
                                  field.onChange(
                                    currentValues.filter(
                                      (v) => v !== currentValue,
                                    ),
                                  );
                                } else {
                                  field.onChange([
                                    ...currentValues,
                                    currentValue,
                                  ]);
                                }
                                setOpen(true);
                              }}
                            >
                              {framework.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  Array.isArray(field.value) &&
                                    field.value.includes(framework.value)
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
