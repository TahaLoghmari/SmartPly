import { useApplicationsInterviewingCountStore } from "#/applications";

export function ApplicationsHeaderInterviewingCard() {
  const { interviewingCount } = useApplicationsInterviewingCountStore();
  return (
    <div className="bg-card text-card-foreground rounded-lg border p-4 shadow-xs">
      <div className="text-2xl font-bold">{interviewingCount}</div>
      <p className="text-muted-foreground text-sm">Interviewing</p>
    </div>
  );
}
