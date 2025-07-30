import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type ApplicationFormContentProps } from "#/applications";

export function ApplicationsFormCompanyInformation({
  form,
}: ApplicationFormContentProps) {
  return (
    <div className="space-y-4">
      <p className="text-foreground border-b pb-2 text-lg font-medium">
        Company Information
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Company Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Google, Microsoft"
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
          name="companyEmail"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <FormLabel>Company Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="careers@company.com"
                  type="email"
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
