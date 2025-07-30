import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type ApplicationFormContentProps } from "#/applications";

export function ApplicationsFormCompensation({
  form,
}: ApplicationFormContentProps) {
  return (
    <div className="space-y-4">
      <p className="text-foreground border-b pb-2 text-lg font-medium">
        Compensation
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="startSalary"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel className="flex items-center gap-1">
                Salary{" "}
                <span className="bg-accent text-accent-foreground rounded-full p-1.5 px-3 text-xs font-normal">
                  /yr
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Min. Salary"
                  type="number"
                  className="shadow-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endSalary"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel className="min-h-7"></FormLabel>
              <FormControl>
                <Input
                  placeholder="Max. Salary"
                  type="number"
                  className="shadow-none"
                  {...field}
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
