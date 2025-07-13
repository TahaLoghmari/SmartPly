import {
  EditApplicationButton,
  DeleteApplicationButton,
  type ApplicationPageProps,
} from "#/applications";

export function Actions({ applicationCard }: ApplicationPageProps) {
  
  return (
    <div className="bg-card text-card-foreground flex min-w-70 flex-col gap-5 rounded-lg border p-6">
      <p className="text-2xl leading-none font-semibold tracking-tight">
        Actions
      </p>
      <div className="flex flex-col gap-3 pt-2">
        <EditApplicationButton applicationCard={applicationCard} />
        <DeleteApplicationButton />
      </div>
    </div>
  );
}
