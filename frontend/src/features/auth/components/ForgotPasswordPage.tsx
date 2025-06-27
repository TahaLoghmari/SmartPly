import { ForgotPasswordForm } from "../../auth";
import questionMark from "../../../shared/assets/questionMark.png";
import { useForgotPasswordStore } from "../stores/useForgotPasswordStore";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function ForgotPasswordPage() {
  const { hasClickedResetPassword, email } = useForgotPasswordStore();
  const forgotPasswordMutation = useForgotPassword();
  return (
    <div className="flex min-h-screen w-screen flex-col items-center sm:rounded-md sm:bg-[#f0f3f5]">
      <div className="bg-background flex w-full flex-col items-center gap-8 p-9 sm:my-20 sm:w-[450px] sm:rounded-lg sm:p-12">
        {!hasClickedResetPassword ? (
          <>
            <img src={questionMark} alt="questionMark" />
            <div className="flex flex-col items-center justify-center">
              <p className="text-2xl font-semibold text-[#43346a]">
                Forgot your password?
              </p>
              <p className="text-sm text-[#7e838b]">
                Enter your email to reset your password
              </p>
            </div>
            <ForgotPasswordForm />
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
              viewBox="0 0 64 64"
            >
              <linearGradient
                id="jrdie3LmJ3jWsUqXwljwga_PZlBgZ6X9dEb_gr1"
                x1="32"
                x2="32"
                y1="809"
                y2="754.866"
                gradientTransform="matrix(1 0 0 -1 0 814)"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stop-color="#1a6dff"></stop>
                <stop offset="1" stop-color="#c822ff"></stop>
              </linearGradient>
              <path
                fill="url(#jrdie3LmJ3jWsUqXwljwga_PZlBgZ6X9dEb_gr1)"
                d="M32,58C17.663,58,6,46.337,6,32S17.663,6,32,6s26,11.663,26,26S46.337,58,32,58z M32,8	C18.767,8,8,18.767,8,32s10.767,24,24,24s24-10.767,24-24S45.233,8,32,8z"
              ></path>
              <linearGradient
                id="jrdie3LmJ3jWsUqXwljwgb_PZlBgZ6X9dEb_gr2"
                x1="32"
                x2="32"
                y1="809"
                y2="754.866"
                gradientTransform="matrix(1 0 0 -1 0 814)"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stop-color="#1a6dff"></stop>
                <stop offset="1" stop-color="#c822ff"></stop>
              </linearGradient>
              <path
                fill="url(#jrdie3LmJ3jWsUqXwljwgb_PZlBgZ6X9dEb_gr2)"
                d="M32,52c-11.028,0-20-8.972-20-20s8.972-20,20-20s20,8.972,20,20S43.028,52,32,52z M32,14	c-9.925,0-18,8.075-18,18s8.075,18,18,18s18-8.075,18-18S41.925,14,32,14z"
              ></path>
              <linearGradient
                id="jrdie3LmJ3jWsUqXwljwgc_PZlBgZ6X9dEb_gr3"
                x1="32"
                x2="32"
                y1="25.197"
                y2="41.004"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stop-color="#6dc7ff"></stop>
                <stop offset="1" stop-color="#e6abff"></stop>
              </linearGradient>
              <path
                fill="url(#jrdie3LmJ3jWsUqXwljwgc_PZlBgZ6X9dEb_gr3)"
                d="M27.832,40.418l-6.279-6.279c-0.391-0.391-0.391-1.024,0-1.414l1.414-1.414	c0.39-0.391,1.024-0.391,1.414,0l4.846,4.845L39.59,25.499c0.385-0.396,1.018-0.405,1.414-0.02l1.434,1.394	c0.396,0.385,0.405,1.018,0.02,1.414l-11.778,12.11C29.902,41.198,28.62,41.206,27.832,40.418z"
              ></path>
            </svg>
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
              className="w-full cursor-pointer bg-gradient-to-r from-[#6c79e1] to-[#7057b0]"
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
              <Link to="/login" className="font-semibold text-[#7057b0]">
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
