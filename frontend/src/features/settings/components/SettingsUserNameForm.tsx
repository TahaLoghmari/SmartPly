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
import {
  UserNameFormDefaults,
  UserNameFormSchema,
  useUpdateCurrentUser,
  type UserRequestDto,
} from "#/settings";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "#/auth";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function SettingsUserNameForm() {
  const { data: user } = useCurrentUser();

  const form = useForm<z.infer<typeof UserNameFormSchema>>({
    resolver: zodResolver(UserNameFormSchema),
    mode: "onChange",
    defaultValues: UserNameFormDefaults(),
  });
  const updateCurrentUserMutation = useUpdateCurrentUser();

  const onSubmit = (data: z.infer<typeof UserNameFormSchema>) => {
    const userRequest: UserRequestDto = {
      name: data.name,
      password: undefined,
      confirmPassword: undefined,
      currentPassword: undefined,
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
