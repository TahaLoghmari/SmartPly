import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useGetGoogleOAuthUrl,
  useLogin,
  type LoginUserDto,
  loginFormSchema,
} from "#/auth";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const getGoogleOAuthUrlMutation = useGetGoogleOAuthUrl();
  const [searchParams, setSearchParams] = useSearchParams();
  const loginMutation = useLogin();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
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
    loginMutation.error?.title?.startsWith("Email not Verified");

  // this is for google signin/signup failing
  useEffect(() => {
    const message = searchParams.get("message");
    if (message) {
      toast.error(message);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {loginMutation.isError && (
                <div className="bg-destructive/10 border-destructive text-destructive mb-4 rounded-md border p-3 text-sm">
                  <div className="flex flex-col gap-1">
                    <p>{loginMutation.error?.title}</p>
                    <p>{loginMutation.error?.detail}</p>
                  </div>
                  {isEmailNotVerified && (
                    <div className="mt-2">
                      <Link
                        to={`/email-verification/?email=${form.getValues("email")}`}
                        className="text-muted-foreground hover:text-muted-foreground/20 underline"
                      >
                        Resend Email
                      </Link>
                    </div>
                  )}
                </div>
              )}
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      getGoogleOAuthUrlMutation.mutate();
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Login with Google
                  </Button>
                </div>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel>Password</FormLabel>
                            <Link
                              to="/forgot-password"
                              className="ml-auto text-sm underline-offset-4 hover:underline"
                            >
                              Forgot your password?
                            </Link>
                          </div>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      !form.formState.isValid || loginMutation.isPending
                    }
                  >
                    {loginMutation.isPending ? (
                      <Spinner className="h-8 w-auto invert dark:invert-0" />
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/register" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
