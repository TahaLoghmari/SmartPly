import { type ApplicationRequestDto } from "#/applications";
import type { UseFormReturn } from "react-hook-form";
import { useCoverLetterStore, useGetUserResumes } from "#/documents";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

export function Documents({
  form,
}: {
  form: UseFormReturn<ApplicationRequestDto>;
}) {
  const { data: resumes } = useGetUserResumes();
  const { coverLettersState } = useCoverLetterStore();
  const resumesState = resumes ?? [];
  return (
    <div className="space-y-4">
      <p className="text-foreground border-b pb-2 text-lg font-medium">
        Documents
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="resumeId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Resume *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? resumesState.find(
                            (resume) => resume.id === field.value,
                          )?.name
                        : "Select Resume"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search Resume..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No Resumes found.</CommandEmpty>
                      <CommandGroup>
                        {resumesState.map((resume) => (
                          <CommandItem
                            value={resume.name}
                            key={resume.id}
                            onSelect={() => {
                              form.setValue("resumeId", resume.id);
                            }}
                          >
                            {resume.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                resume.id === field.value
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverLetterId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Cover Letter</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? coverLettersState.find(
                            (coverLetter) => coverLetter.id === field.value,
                          )?.name
                        : "Select Cover Letter"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search Cover Letter..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No Cover Letters found.</CommandEmpty>
                      <CommandGroup>
                        {coverLettersState.map((coverLetter) => (
                          <CommandItem
                            value={coverLetter.name}
                            key={coverLetter.id}
                            onSelect={() => {
                              form.setValue("coverLetterId", coverLetter.id);
                            }}
                          >
                            {coverLetter.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                coverLetter.id === field.value
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
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
