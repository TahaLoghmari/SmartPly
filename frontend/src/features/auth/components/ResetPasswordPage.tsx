import { ResetPasswordForm } from "../../auth";
import { LockKeyholeOpen } from "lucide-react";

export function ResetPasswordPage() {
  return (
    <div className="from-background via-background to-muted flex min-h-screen w-screen flex-col items-center bg-gradient-to-br sm:rounded-md">
      <div className="bg-card text-card-foreground border-border/50 flex w-full flex-col items-center gap-3 border p-9 shadow-2xl sm:my-20 sm:w-[450px] sm:rounded-lg sm:p-12">
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
