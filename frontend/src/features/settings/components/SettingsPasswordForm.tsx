import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import type z from "zod";
import {
  PasswordFormDefaults,
  PasswordFormSchema,
  useUpdateCurrentUser,
  type UserRequestDto,
} from "#/settings";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export function SettingsPasswordForm() {
  const form = useForm<z.infer<typeof PasswordFormSchema>>({
    resolver: zodResolver(PasswordFormSchema),
    mode: "onChange",
    defaultValues: PasswordFormDefaults(),
  });
  const updateCurrentUserMutation = useUpdateCurrentUser();
  const onSubmit = (data: z.infer<typeof PasswordFormSchema>) => {
    const userRequest: UserRequestDto = {
      name: undefined,
      password: data.password,
      confirmPassword: data.confirmPassword,
      currentPassword: data.currentPassword,
    };

    updateCurrentUserMutation.mutate(userRequest, {
      onSuccess: () => {
        form.reset();
      },
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem className="mb-6 flex-1 gap-3">
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
            className="mt-10 w-[148px] cursor-pointer"
            disabled={!form.formState.isValid}
          >
            {updateCurrentUserMutation.isPending ? (
              <Spinner className="h-5 w-5 border-2 invert" />
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
