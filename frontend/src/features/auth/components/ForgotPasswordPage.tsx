import {
  ForgotPasswordForm,
  useForgotPassword,
  useForgotPasswordStore,
} from "../../auth";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { CircleCheckBig } from "lucide-react";

export function ForgotPasswordPage() {
  const { hasClickedResetPassword, email } = useForgotPasswordStore();
  const forgotPasswordMutation = useForgotPassword();
  return (
    <div className="flex min-h-screen w-screen flex-col items-center sm:rounded-md sm:bg-[#f0f3f5]">
      <div className="bg-background flex w-full flex-col items-center gap-6 p-9 sm:my-20 sm:w-[450px] sm:rounded-lg sm:p-12">
        {!hasClickedResetPassword ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-circle-question-mark-icon lucide-circle-question-mark h-10 w-auto"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
            <div className="flex flex-col items-center justify-center">
              <p className="text-primary text-2xl font-semibold">
                Forgot your password?
              </p>
              <p className="text-muted-foreground text-sm">
                Enter your email to reset your password
              </p>
            </div>
            <ForgotPasswordForm />
          </>
        ) : (
          <>
            <CircleCheckBig className="h-15 w-auto" />
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-2xl font-semibold text-[#43346a]">
                Check your email
              </p>
              <p className="text-center text-sm text-[#7e838b]">
                We sent an email to {email}. Click the link in the email to
                reset your password.
              </p>
              <p className="text-center text-sm text-[#7e838b]">
                If you don't see an email from us, try checking your junk or
                spam folder.
              </p>
            </div>
            <Button
              type="button"
              className="w-full cursor-pointer"
              disabled={forgotPasswordMutation.isPending}
              onClick={() => {
                forgotPasswordMutation.mutate({ email });
                toast.success("Please check your inbox!");
              }}
            >
              {forgotPasswordMutation.isPending ? (
                <Spinner className="h-8 w-auto" />
              ) : (
                "Resend Email"
              )}
            </Button>
            <div className="flex w-full cursor-pointer items-center justify-center">
              <Link to="/login" className="text-muted-foreground font-semibold">
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
