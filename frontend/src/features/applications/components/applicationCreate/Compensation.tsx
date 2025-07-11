import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type ApplicationRequestDto } from "#/applications";
import type { UseFormReturn } from "react-hook-form";

export function Compensation({
  form,
}: {
  form: UseFormReturn<ApplicationRequestDto>;
}) {
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
              <FormLabel>Yearly Starting Salary (k) *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. 150"
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
              <FormLabel>Yearly Maximum Salary (k) *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. 200"
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
