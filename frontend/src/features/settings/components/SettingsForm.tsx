import { Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EditUserFormDefaults, EditUserFormSchema } from "#/settings";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "#/auth";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function SettingsForm() {
  const onSubmit = () => {};
  const { data: user } = useCurrentUser();
  // handle errors, loading

  const form = useForm<z.infer<typeof EditUserFormSchema>>({
    resolver: zodResolver(EditUserFormSchema),
    mode: "onChange",
    defaultValues: EditUserFormDefaults(),
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-1 flex-col gap-3">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-1 flex-col gap-3">
            <Label>Email Adress</Label>
            <Input
              type="email"
              placeholder="Email"
              className="bg-accent"
              value={user?.email}
              disabled
            />
            <span className="text-muted-foreground text-xs">
              Email adress cannot be changed.
            </span>
          </div>
        </div>
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem className="mt-10 mb-6 flex-1 gap-3">
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your current password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex-1 gap-3">
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="flex-1 gap-3">
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex w-full justify-end">
          <Button
            type="submit"
            className="mt-10 cursor-pointer"
            disabled={!form.formState.isValid}
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
