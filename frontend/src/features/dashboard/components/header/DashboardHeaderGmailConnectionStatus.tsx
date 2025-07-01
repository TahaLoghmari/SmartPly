import { useAuthStore } from "#/auth";

export function DashboardHeaderGmailConnectionStatus() {
  const { user } = useAuthStore();
  return (
    <div
      className={`rounded-full ${user?.gmailConnected ? "bg-[#dcfce7]" : "bg-[#fef2f2]"} px-2 py-1`}
    >
      <p
        className={`text-xs font-semibold ${user?.gmailConnected ? "text-green-700" : "text-red-700"}`}
      >
        {user?.gmailConnected ? "Gmail Connected" : "Gmail Not Connected"}
      </p>
    </div>
  );
}
