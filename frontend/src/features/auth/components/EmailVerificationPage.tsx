import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { useResendConfirmationEmail } from "../../auth";

import { MoveRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export function EmailVerificationPage() {
  const resendConfirmationEmailMutation = useResendConfirmationEmail();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="sm:bg-secondary flex min-h-screen w-screen flex-col items-center sm:rounded-md">
      <div className="bg-card flex w-full flex-col items-center gap-8 p-9 sm:my-20 sm:w-[550px] sm:rounded-lg sm:p-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          className="text-primary h-25 w-25"
          viewBox="0,0,256,256"
        >
          <g
            fill="currentColor"
            fill-rule="nonzero"
            stroke="none"
            stroke-width="1"
            stroke-linecap="butt"
            stroke-linejoin="miter"
            stroke-miterlimit="10"
            stroke-dasharray=""
            stroke-dashoffset="0"
            font-family="none"
            font-weight="none"
            font-size="none"
            text-anchor="none"
            style={{ mixBlendMode: "normal" }}
          >
            <g transform="scale(5.12,5.12)">
              <path d="M14,4c-5.51133,0 -10,4.48867 -10,10v22c0,5.51133 4.48867,10 10,10h22c5.51133,0 10,-4.48867 10,-10v-22c0,-5.51133 -4.48867,-10 -10,-10zM13,16h24c0.18,0 0.34977,0.02031 0.50977,0.07031l-9.83008,9.82031c-1.48,1.48 -3.88914,1.48 -5.36914,0l-9.82031,-9.82031c0.16,-0.05 0.32977,-0.07031 0.50977,-0.07031zM11.07031,17.49023l7.51953,7.50977l-7.51953,7.50977c-0.05,-0.16 -0.07031,-0.32977 -0.07031,-0.50977v-14c0,-0.18 0.02031,-0.34977 0.07031,-0.50977zM38.92969,17.49023c0.05,0.16 0.07031,0.32977 0.07031,0.50977v14c0,0.18 -0.02031,0.34977 -0.07031,0.50977l-7.5293,-7.50977zM20,26.41016l0.89063,0.90039c1.13,1.13 2.61961,1.68945 4.09961,1.68945c1.49,0 2.96961,-0.55945 4.09961,-1.68945l0.90039,-0.90039l7.51953,7.51953c-0.16,0.05 -0.32977,0.07031 -0.50977,0.07031h-24c-0.18,0 -0.34977,-0.02031 -0.50977,-0.07031z"></path>
            </g>
          </g>
        </svg>
        <p className="text-2xl font-bold sm:text-3xl">
          Verify your email address
        </p>
        <p className="text-center">
          We have sent a verification link to{" "}
          <span className="font-bold">{email}</span>.
        </p>
        <p className="text-center">
          Click on the link to complete the verification process.
        </p>
        <p className="text-center">
          You might need to{" "}
          <span className="font-bold">check your spam folder</span>.
        </p>
        <div className="flex gap-3">
          <Button
            className="cursor-pointer p-6"
            onClick={() => {
              if (email) {
                resendConfirmationEmailMutation.mutate(email);
              }
            }}
            disabled={resendConfirmationEmailMutation.isPending}
          >
            {resendConfirmationEmailMutation.isPending ? (
              <Spinner className="h-8 w-auto" />
            ) : (
              "Resend Email"
            )}
          </Button>
          <Link
            to="/login"
            className="text-muted-foreground flex cursor-pointer items-center justify-center gap-1"
          >
            Return to Site <MoveRight />
          </Link>
        </div>
        <p className="text-muted-foreground text-center text-sm">
          Once you have verified your email, you can click on "Return to Site"
          to Log In.
        </p>
      </div>
    </div>
  );
}
