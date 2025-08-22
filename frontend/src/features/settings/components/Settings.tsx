import { useCurrentUser } from "#/auth";
import {
  SettingsUserNameForm,
  SettingsDeleteAccountButton,
  SettingsPasswordForm,
} from "#/settings";

export function Settings() {
  const { data: user } = useCurrentUser();
  return (
    <div className="flex flex-1 flex-col items-center overflow-auto transition-[width,height,margin,padding] duration-300">
      <div className="flex w-full flex-col gap-7 p-6 lg:w-[90%] xl:w-[75%] 2xl:w-[60%]">
        <div className="flex flex-col">
          <p className="text-3xl font-bold tracking-tight">Settings</p>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences.
          </p>
        </div>
        <div className="bg-card flex flex-col gap-6 rounded-lg border p-8 shadow-xs">
          <div className="flex flex-col">
            <p className="text-xl font-bold tracking-tight">
              Profile Information
            </p>
            <p className="text-muted-foreground mt-1">
              Update your personal information and email address.
            </p>
          </div>
          <SettingsUserNameForm />
        </div>
        {user?.hasPassword && (
          <div className="bg-card flex flex-col gap-6 rounded-lg border p-8 shadow-xs">
            <div className="flex flex-col">
              <p className="text-xl font-bold tracking-tight">
                Change Password
              </p>
              <p className="text-muted-foreground mt-1">
                Update your password to keep your account secure.
              </p>
            </div>
            <SettingsPasswordForm />
          </div>
        )}
        <div className="bg-card flex flex-col gap-6 rounded-lg border p-8 shadow-xs">
          <div className="flex flex-col">
            <p className="text-xl font-bold tracking-tight">
              Account Management
            </p>
            <p className="text-muted-foreground mt-1">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
          </div>
          <SettingsDeleteAccountButton />
        </div>
      </div>
    </div>
  );
}
