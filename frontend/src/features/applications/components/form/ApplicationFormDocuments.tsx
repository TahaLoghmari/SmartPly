import { type ApplicationFormContentProps } from "#/applications";
import { useGetUserResumes } from "#/resumes";
import { useGetUserCoverLetters } from "#/coverLetters";
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
import { Spinner } from "@/components/ui/spinner";

export default function ApplicationFormDocuments({
  form,
}: ApplicationFormContentProps) {
  const {
    data: resumes,
    isLoading: AreResumesLoading,
    isError: DidResumeFetchingFail,
    refetch: refetchResumes,
  } = useGetUserResumes();
  const {
    data: coverLetters,
    isLoading: AreCoverLettersLoading,
    isError: DidCVFetchingFail,
    refetch: refetchCVs,
  } = useGetUserCoverLetters();
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
              {DidResumeFetchingFail && (
                <div className="flex w-full flex-col items-center justify-center gap-2">
                  <span className="text-muted-foreground text-sm">
                    Failed to load resumes.
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => refetchResumes()}
                  >
                    Retry
                  </Button>
                </div>
              )}
              {AreResumesLoading && (
                <div className="flex w-full items-center justify-center">
                  <Spinner className="h-5 w-5 border-2" />
                </div>
              )}
              {!DidResumeFetchingFail && !AreResumesLoading && (
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
                          ? resumes!.find((resume) => resume.id === field.value)
                              ?.name
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
                          {resumes!.map((resume) => (
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
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverLetterId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Cover Letter *</FormLabel>
              {DidCVFetchingFail && (
                <div className="flex w-full flex-col items-center justify-center gap-2">
                  <span className="text-muted-foreground text-sm">
                    Failed to load cover letters.
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => refetchCVs()}
                  >
                    Retry
                  </Button>
                </div>
              )}
              {AreCoverLettersLoading && (
                <div className="flex w-full items-center justify-center">
                  <Spinner className="h-5 w-5 border-2" />
                </div>
              )}
              {!DidCVFetchingFail && !AreCoverLettersLoading && (
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
                          ? coverLetters!.find(
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
                          {coverLetters!.map((coverLetter) => (
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
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
