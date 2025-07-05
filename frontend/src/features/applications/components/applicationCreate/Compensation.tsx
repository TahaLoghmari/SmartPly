import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type ApplicationCreateFormProps } from "#/applications";

export function Compensation({ form }: ApplicationCreateFormProps) {
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
              <FormLabel>Starting Salary ($) *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. 150000"
                  type="number"
                  {...field}
                  className="shadow-none"
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
              <FormLabel>Maximum Salary ($) *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. 200000"
                  type="number"
                  {...field}
                  className="shadow-none"
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
