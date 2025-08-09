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
import { Link, useNavigate } from "react-router-dom";
import {
  useForgotPassword,
  forgotPasswordFormSchema,
  type ForgotPasswordDto,
  ForgotPasswordDefautls,
} from "#/auth";

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPassword();
  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    mode: "onChange",
    defaultValues: ForgotPasswordDefautls(),
  });
  async function onSubmit(credentials: ForgotPasswordDto) {
    forgotPasswordMutation.mutate(credentials, {
      onSuccess: () => {
        navigate(`/forgot-password?email=${credentials.email}`);
      },
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
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
            <Spinner className="h-5 w-5 border-2 invert" />
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
