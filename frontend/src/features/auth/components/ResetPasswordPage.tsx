import { ResetPasswordForm } from "../../auth";
import { LockKeyholeOpen } from "lucide-react";

export function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen w-screen flex-col items-center sm:rounded-md sm:bg-[#f0f3f5]">
      <div className="bg-background flex w-full flex-col items-center gap-3 p-9 sm:my-20 sm:w-[450px] sm:rounded-lg sm:p-12">
        <LockKeyholeOpen className="h-15 w-auto" />
        <div className="flex flex-col items-center justify-center">
          <p className="text-primary text-2xl font-semibold">
            Reset your Password
          </p>
          <p className="text-sm text-[#7e838b]">Enter your new password</p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
