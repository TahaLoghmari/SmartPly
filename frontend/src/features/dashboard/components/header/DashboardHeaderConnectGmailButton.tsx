import { Mail, X, Zap, Shield } from "lucide-react";
import {
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useGetGoogleLinkOAuthUrl } from "#/auth";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardHeaderConnectGmailButton() {
  const getGoogleOAuthUrlMutation = useGetGoogleLinkOAuthUrl();
  return (
    <>
      <div className="flex items-center justify-between border-b p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-primary text-xl font-semibold">Connect Gmail</p>
          <div></div>
        </div>
        <AlertDialogCancel asChild className="border-0 shadow-none">
          <div className="text-muted-foreground hover:bg-muted rounded-lg p-2 transition-[width,height,margin,padding] duration-200">
            <X className="h-5 w-5" />
          </div>
        </AlertDialogCancel>
      </div>
      <div className="flex flex-col gap-6 p-6">
        <p className="text-muted-foreground">
          Connect your Gmail account to automatically track job application
          emails and responses.
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
              <Mail className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex flex-col">
              <p className="text-primary font-medium">Auto-sync Applications</p>
              <p className="text-muted-foreground text-sm">
                Automatically detect and organize job application emails
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
              <Zap className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <p className="text-primary font-medium">Smart Notifications</p>
              <p className="text-muted-foreground text-sm">
                Get notified when you receive responses from employers
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
              <Shield className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex flex-col">
              <p className="text-primary font-medium">Secure & Private</p>
              <p className="text-muted-foreground text-sm">
                Your data is encrypted and never shared with third parties
              </p>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <button
              onClick={() => {
                getGoogleOAuthUrlMutation.mutate();
              }}
              className="flex w-full cursor-pointer items-center justify-center border transition-colors"
            >
              {getGoogleOAuthUrlMutation.isPending ? (
                <Spinner className="h-5 w-5 border-2 invert dark:invert-0" />
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    className="h-5 w-5"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    ></path>
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    ></path>
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                  </svg>
                  <p className="text-secondary">Log in with Google</p>
                </>
              )}
            </button>
          </AlertDialogAction>
        </AlertDialogFooter>
        <p className="text-muted-foreground text-center text-xs">
          By connecting, you agree to our terms of service and privacy policy
        </p>
      </div>
    </>
  );
}
