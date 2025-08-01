import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useResendConfirmationEmail } from "#/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoveLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export default function EmailVerificationPage() {
  const resendConfirmationEmailMutation = useResendConfirmationEmail();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  return (
    <>
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 724 191"
            preserveAspectRatio="xMidYMid meet"
            className="h-auto w-40 self-center"
            fill="currentColor"
          >
            <path d="M46.9 10c-9.3 2.5-15.2 6-22.6 13-3.5 3.4-6.3 6.4-6.3 6.7 0 .4-.9 1.6-1.9 2.7C13.7 35 9.4 45.8 7.9 53 6.5 59.4 7.2 76.1 9 80.5c3.7 9 7.1 15.5 8 15.5.5 0 1 .6 1 1.3 0 2.2 22.3 21.7 24.8 21.7.5 0 1.7.8 2.8 1.8 2.2 2 14.2 9.2 15.3 9.2.4 0 3.2 1.3 6.2 2.9 5.7 3 14.4 4.5 19.9 3.5 7.6-1.6 9.7-14.8 2.9-18.5-1.2-.6-6-2.1-10.8-3.3-8.4-2.1-12.1-3.8-18.5-8.3a41.45 41.45 0 0 0-5.6-3.5c-1.4-.7-2.9-1.8-3.5-2.4-.5-.6-3-2.6-5.5-4.4-2.5-1.9-6.8-5.8-9.6-8.7-4.6-4.6-5.3-6-6.8-12.4-.9-3.9-1.6-9.5-1.6-12.3 0-6.6 2.3-15.3 4.8-18 1.1-1.1 2.1-2.6 2.3-3.2.8-2 8.5-8.1 13.4-10.5s5.3-2.4 35-2.4c29.6 0 30.1 0 35 2.4 9.2 4.4 14.5 12.2 14.5 21.2 0 5.1 1.4 5.9 10.1 5.9 6 0 8.2-.4 10-1.9 2.3-1.8 2.3-2.1 1.1-8.1-1.5-6.9-6.9-18.9-8.9-19.7-.7-.3-1.3-1-1.3-1.7 0-1.3-6.6-7.7-10.4-10a245.81 245.81 0 0 0-5.3-3.3c-1.6-1-5.7-2.5-9.3-3.5-9.7-2.6-62.4-2.5-72.1.2zM215 51.9c-5.9 1.4-13.3 5.2-16.4 8.5-9.8 10.5-7.5 29.4 4.5 36.6 5.2 3.1 9.4 5 10.9 5 3.4 0 18.6 6.9 20.3 9.2 3.6 4.8 2 13.5-3.1 17.3-2.3 1.7-4.3 2-12.7 2-9 0-10.5-.3-14.9-2.8-2.7-1.5-5.4-2.7-6.1-2.7-.6 0-2-.9-3-2s-2.2-2-2.7-2c-.4 0-.8 3.3-.8 7.4 0 8 .6 9 8 12.3 3.9 1.7 16.4 4.3 20.6 4.3 4.7 0 19.4-3.4 20.3-4.7.3-.5 2-1.9 3.7-3 1.7-1.2 4.3-4.1 5.9-6.3 2.7-3.8 2.9-5 2.9-12.8 0-9.3-1-12.3-5.9-17.5-3.3-3.5-12.8-8.3-20.2-10.2-11.5-3-17.3-7.8-17.3-14.5 0-6.1 6.6-11 14.9-11 6.6 0 22.1 5 22.1 7.2 0 .4.7.8 1.5.8 1.3 0 1.5-1.3 1.3-8.1l-.3-8.1-7.5-2.5c-8-2.6-20.1-3.7-26-2.4zM552 97v46.1l7.8-.3 7.7-.3.3-16.3.2-16.2h11.9c6.5 0 13.1-.4 14.7-.9s4.1-1.2 5.5-1.5 3.7-1.6 5.2-3c1.4-1.3 3-2.6 3.4-2.7.5-.2 2.2-2.5 3.9-5.1 5.8-8.8 5.7-23.5-.2-32.3-3.9-5.7-5.7-7.1-13.4-10.6-5.2-2.2-6.8-2.4-26.2-2.7l-20.8-.3V97zm38.7-30.4c6.3 2.1 7.8 3.6 9.4 9.1 1.8 6.5.1 12.7-4.8 17l-3.6 3.3h-11.9H568V80.5 65h9c5.5 0 10.7.6 13.7 1.6zM627 97v46h7.5 7.5V97 51h-7.5-7.5v46zM507 66.5V77h-7-7v5.5V88h7 7l.1 18.7c0 22.8.6 27.1 4.5 31.6 4.7 5.5 14.6 8 22.9 5.7l4.6-1.3-.3-6.1-.3-6.1-3.5-.1c-9-.1-9.6-.3-11.4-3.7-1.5-2.7-1.7-5.7-1.4-20.7l.3-17.5h8 8l.3-5.7.3-5.7-8.3-.3-8.3-.3-.3-10.3-.3-10.2h-7.4-7.5v10.5zM74.6 61.4c-3.3 1-4.1 1.8-5.3 5.6-3.1 9.1 1.1 14 12.1 14 2.7 0 6.5.9 8.8 2s4.5 2 4.9 2c.8 0 12.9 8 14.7 9.7.7.7 1.8 1.3 2.3 1.3 1.5 0 8.5 5.7 14.4 11.7 6.4 6.4 10.1 16.4 9.1 24.2-1.7 13-8.6 23.2-19.8 29.2l-6.3 3.4H76 42.5l-5.9-3.8c-3.2-2.1-6-4.7-6.3-5.8-.3-1-.8-1.9-1.2-1.9-1.7 0-4.5-8-5.1-14l-.5-6.5-7.9-.3c-9.6-.4-11.6.9-11.6 7.2 0 5.7 3.2 16.4 6.5 21.7 6.3 10.1 16.5 18.3 27.7 22.1 5.7 1.9 9 2.2 34.2 2.5 34 .6 43.9-.8 55.6-7.6 6.1-3.6 21-18.5 21-21 0-.5 1.2-3.3 2.8-6.3 2.6-5.1 2.7-5.9 2.7-20.3s-.1-15.2-2.7-20.3c-1.6-3-2.8-5.8-2.8-6.4 0-2.2-9.5-13.1-15.3-17.4-3.4-2.6-6.7-5.2-7.2-5.9-.6-.7-2-1.5-3.3-1.9-1.2-.4-2.2-1.1-2.2-1.6 0-.9-11.9-8.5-14.9-9.5-1.2-.3-2.1-1-2.1-1.4 0-2-15.7-6.2-22.4-6a33.85 33.85 0 0 0-7 1.3zm212.1 16c-2.7 1.3-6 3.6-7.3 5.2l-2.3 2.9-.1-4.8V76h-7-7v33.5 33.6l7.8-.3 7.7-.3.5-22.5c.5-23.5.9-25.4 5.2-28.4 3.3-2.3 15-2.2 16.9.1 3.7 4.7 3.9 6.1 3.9 27.2 0 11.5.3 21.6.6 22.5.5 1.2 2.1 1.6 7.5 1.6h6.9v-13.3c.1-13.4.7-27.6 1.5-31.2.3-1.1 1.8-3.5 3.5-5.3 2.9-3 3.5-3.2 10-3.2 6.8 0 7 .1 9.7 3.7l2.8 3.6.3 22.9.3 22.8h7.5 7.4v-23.4c0-19-.3-24.4-1.7-28.7C358.2 80.8 350.1 75 339 75c-7.3 0-16 3.5-18.6 7.5-2.1 3.2-3.7 3.2-5.4-.1-.8-1.4-3.7-3.6-6.6-5-6.9-3.2-15.1-3.3-21.7 0zm101.3 0c-10.7 3.7-10 3-10 10.7 0 4.9.4 7.1 1.4 7.5.7.3 3.6-.9 6.4-2.7 4.3-2.7 6.3-3.2 13.4-3.6 4.8-.3 9.5 0 11 .6 3.1 1.2 6.8 6.5 6.8 9.8 0 2-.5 2.1-13.7 2.5-14.3.4-13.8.2-22.7 5.6-9.3 5.6-10.1 22.8-1.4 30.9 3.3 3.1 12.1 6.3 17.2 6.3 6 0 14.2-2.8 17.7-6.1l2.9-2.7v3.4 3.4h7.6 7.6l-.4-25.3c-.3-25-.3-25.2-2.9-30.2-3.5-6.5-5.1-7.8-12.7-10.4-8.5-2.9-19.4-2.8-28.2.3zm29 37.3c0 7.5-3.7 13.5-10.3 16.5-4.7 2.2-7.9 2.3-12.3.2-7.1-3.4-8.6-10.1-3.4-15.3 3.2-3.2 4.8-3.5 19.8-3.9 6.1-.2 6.2-.2 6.2 2.5zm54.5-37.8c-2.3 1-5.3 3.3-6.8 5l-2.7 3.3v-4.6V76h-7.5-7.5v33.5V143h7.4 7.4l.4-19.8c.4-21.5.9-23.6 6.9-29.4 3.5-3.4 6.5-4.2 13-3.6l5 .5-.3-7.6-.3-7.6-5.5-.3c-3.7-.1-6.8.4-9.5 1.7zm185.8-.1l-8.1.3.7 2.7c.5 1.5 2 5.1 3.5 7.9 1.4 2.9 2.6 5.7 2.6 6.2 0 .6 1.4 4 3 7.6 1.7 3.6 3 7 3 7.5 0 .6 1.1 3.3 2.5 6.2 1.4 2.8 2.5 5.8 2.5 6.5 0 .8 1.2 3.7 2.6 6.5 4.6 9.1 5.5 13.3 3.7 18.4-1.8 5.3-5.5 8.2-11.6 9-4.2.6-4.5.9-5.1 4.3-.3 2-.6 5.1-.6 6.8v3.3h6.6c11 0 17.8-4.7 23.6-16.1 4.1-8.3 9.8-21.7 9.8-23.1 0-.6.7-2.4 1.5-4.1.8-1.8 2.3-5.7 3.4-8.7 1-3 2.9-8 4.1-11l9.9-24.8 2-5.2h-8-7.9l-2.5 5.6c-1.4 3.1-2.5 6.2-2.5 6.9s-1.3 4.3-3 8c-1.6 3.7-3 7.3-3 8.1s-1.3 4.4-3 8.1c-1.6 3.6-3 7.3-3 8.2 0 2.2-2.7-3.1-4.4-8.7-.7-2.6-2.5-7.3-4-10.6-1.4-3.2-2.6-6.4-2.6-7.2 0-.7-1.3-4.2-3-7.7-1.6-3.6-3-7.4-3-8.6 0-2.6-.1-2.6-9.7-2.3z" />
          </svg>
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">
                  Verify your email address
                </CardTitle>
                <CardDescription>
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-muted-foreground">
                      We have sent a verification link to:
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {email}
                    </p>
                    <p className="text-muted-foreground text-center text-sm">
                      Click on the link to complete the verification process.
                    </p>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex w-full items-center justify-center rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Note:</strong> You might need to check your spam
                    folder.
                  </p>
                </div>
                <div className="flex w-full flex-col gap-3">
                  <Button
                    className="w-full cursor-pointer p-6"
                    onClick={() => {
                      if (email) {
                        resendConfirmationEmailMutation.mutate(email);
                      }
                    }}
                    disabled={resendConfirmationEmailMutation.isPending}
                  >
                    {resendConfirmationEmailMutation.isPending ? (
                      <Spinner className="h-8 w-auto invert dark:invert-0" />
                    ) : (
                      "Resend Email"
                    )}
                  </Button>
                  <Button variant="outline">
                    <Link
                      to="/login"
                      className="text-muted-foreground flex cursor-pointer items-center justify-center gap-2"
                    >
                      <MoveLeft />
                      Return to Site
                    </Link>
                  </Button>
                </div>
                <p className="text-muted-foreground text-center text-xs">
                  Once you have verified your email, you can click on "Return to
                  Site" to Log In.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
