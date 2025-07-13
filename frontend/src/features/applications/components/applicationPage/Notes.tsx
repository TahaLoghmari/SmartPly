import { type ApplicationPageProps } from "#/applications";

export function Notes({ applicationCard }: ApplicationPageProps) {
  return (
    <div className="bg-card text-card-foreground flex min-w-70 flex-col gap-5 rounded-lg border p-6">
      <p className="text-2xl leading-none font-semibold tracking-tight">
        Notes
      </p>
      <div className="bg-accent rounded-lg p-3">
        <p className="text-muted-foreground text-sm italic">
          "{applicationCard.notes}"
        </p>
      </div>
    </div>
  );
}
