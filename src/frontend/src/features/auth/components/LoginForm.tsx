import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

import { useLogin } from "../../auth";

import type { LoginUserDto } from "../types";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Invalid email format." })
    .max(256, { message: "Email must be at most 256 characters." }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export function LoginForm() {
  const loginMutation = useLogin();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(credentials: LoginUserDto) {
    loginMutation.mutate(credentials);
  }
  const isEmailNotVerified =
    loginMutation.error?.message?.startsWith("Email not Verified");
  const errorMessage = loginMutation.error?.message;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        {loginMutation.isError && (
          <div className="bg-destructive/10 border-destructive text-destructive mb-4 rounded-md border p-3 text-sm">
            <div>{errorMessage}</div>
            {isEmailNotVerified && (
              <div className="mt-2">
                <Link
                  to={`/email-verification/?email=${form.getValues("email")}`}
                  className="text-[#7057b0] underline hover:text-[#9e85f4]"
                >
                  Resend Email
                </Link>
              </div>
            )}
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormDescription>
                <Link
                  to="/forgot-password"
                  className="font-semibold text-[#7057b0] underline decoration-solid"
                >
                  Forgot your password?
                </Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full cursor-pointer bg-gradient-to-r from-[#6c79e1] to-[#7057b0]"
          disabled={!form.formState.isValid || loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <Spinner className="h-8 w-auto" />
          ) : (
            "Login"
          )}
        </Button>
        <p className="text-sm font-semibold">
          Don't have an account ?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#7057b0] underline decoration-solid"
          >
            Register now
          </Link>
        </p>
      </form>
    </Form>
  );
}
