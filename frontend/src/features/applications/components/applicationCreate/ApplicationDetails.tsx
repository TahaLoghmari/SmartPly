import {
  type ApplicationCreateFormProps,
  ApplicationFilterBar,
  applicationsStatusFilterOptionsConstant,
  applicationsTypeFilterOptionsConstant,
  applicationsLevelFilterOptionsConstant,
  applicationsJobTypeFilterOptionsConstant,
} from "#/applications";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";

export function ApplicationDetails({ form }: ApplicationCreateFormProps) {
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
  const [isLevelFilterOpen, setIsLevelFilterOpen] = useState(false);
  const [isJobTypeFilterOpen, setIsJobTypeFilterOpen] = useState(false);
  return (
    <div className="space-y-4">
      <p className="text-foreground border-b pb-2 text-lg font-medium">
        Application Details
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status *</FormLabel>
              <FormControl>
                <ApplicationFilterBar
                  /* like with every field React Hook form creates a new state with field.value and 
                  field.onChange */
                  selectedFilter={field.value}
                  setSelectedFilter={field.onChange}
                  applicationConstant={applicationsStatusFilterOptionsConstant}
                  name={"Status"}
                  isFilterOpen={isStatusFilterOpen}
                  setIsFilterOpen={setIsStatusFilterOpen}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type *</FormLabel>
              <FormControl>
                <ApplicationFilterBar
                  selectedFilter={field.value}
                  setSelectedFilter={field.onChange}
                  applicationConstant={applicationsTypeFilterOptionsConstant}
                  name={"Type"}
                  isFilterOpen={isTypeFilterOpen}
                  setIsFilterOpen={setIsTypeFilterOpen}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level *</FormLabel>
              <FormControl>
                <ApplicationFilterBar
                  selectedFilter={field.value}
                  setSelectedFilter={field.onChange}
                  applicationConstant={applicationsLevelFilterOptionsConstant}
                  name={"Level"}
                  isFilterOpen={isLevelFilterOpen}
                  setIsFilterOpen={setIsLevelFilterOpen}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Type *</FormLabel>
              <FormControl>
                <ApplicationFilterBar
                  selectedFilter={field.value}
                  setSelectedFilter={field.onChange}
                  applicationConstant={applicationsJobTypeFilterOptionsConstant}
                  name={"Job Type"}
                  isFilterOpen={isJobTypeFilterOpen}
                  setIsFilterOpen={setIsJobTypeFilterOpen}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
