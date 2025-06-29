import { useGmailState } from "../..";

export function GmailConnectionStatus() {
  const { gmailState } = useGmailState();
  return (
    <div
      className={`rounded-full ${gmailState === "Gmail Connected" ? "bg-[#dcfce7]" : "bg-[#fef2f2]"} px-2 py-1`}
    >
      <p
        className={`text-xs font-semibold ${gmailState === "Gmail Connected" ? "text-green-700" : "text-red-700"}`}
      >
        {gmailState === "Gmail Connected"
          ? "Gmail Connected"
          : "Gmail Not Connected"}
      </p>
    </div>
  );
}
