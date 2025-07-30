import {
  ApplicationsFilterbar,
  applicationsStatusOptionsConstant,
  applicationsTypeOptionsConstant,
  applicationsLevelOptionsConstant,
  applicationsJobTypeOptionsConstant,
  type ApplicationFormContentProps,
} from "#/applications";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function ApplicationsFormDetails({ form }: ApplicationFormContentProps) {
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
                <ApplicationsFilterbar
                  /* like with every field React Hook form creates a new state with field.value and 
                  field.onChange */
                  selectedFilter={field.value}
                  setSelectedFilter={field.onChange}
                  applicationConstant={applicationsStatusOptionsConstant}
                  name={"Status"}
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
                <ApplicationsFilterbar
                  selectedFilter={field.value}
                  setSelectedFilter={field.onChange}
                  applicationConstant={applicationsTypeOptionsConstant}
                  name={"Type"}
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
                <ApplicationsFilterbar
                  selectedFilter={field.value}
                  setSelectedFilter={field.onChange}
                  applicationConstant={applicationsLevelOptionsConstant}
                  name={"Level"}
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
                <ApplicationsFilterbar
                  selectedFilter={field.value}
                  setSelectedFilter={field.onChange}
                  applicationConstant={applicationsJobTypeOptionsConstant}
                  name={"Job Type"}
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
