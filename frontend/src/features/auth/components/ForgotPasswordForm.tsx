import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "react-router-dom";
import {
  useForgotPassword,
  useForgotPasswordStore,
  type ForgotPasswordDto,
} from "../../auth";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email format." })
    .max(256, { message: "Email must be at most 256 characters." }),
});

export function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPassword();
  const { setResetPasswordClicked } = useForgotPasswordStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });
  async function onSubmit(credentials: ForgotPasswordDto) {
    forgotPasswordMutation.mutate(credentials, {
      onSuccess: () => {
        setResetPasswordClicked(credentials.email);
      },
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        {forgotPasswordMutation.isError && (
          <div className="bg-destructive/10 border-destructive text-destructive mb-4 rounded-md border p-3 text-sm">
            {forgotPasswordMutation.error.message}
          </div>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={!form.formState.isValid || forgotPasswordMutation.isPending}
        >
          {forgotPasswordMutation.isPending ? (
            <Spinner className="h-8 w-auto invert dark:invert-0" />
          ) : (
            "Reset Password"
          )}
        </Button>
        <div className="flex w-full cursor-pointer items-center justify-center">
          <Link to="/login" className="text-primary font-semibold">
            Back to Login
          </Link>
        </div>
      </form>
    </Form>
  );
}
