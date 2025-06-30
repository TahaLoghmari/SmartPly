import { useApplicationsOfferCountStore } from "#/applications";

export function ApplicationsHeaderOfferCard() {
  const { offerCount } = useApplicationsOfferCountStore();
  return (
    <div className="bg-card text-card-foreground rounded-lg border p-4 shadow-xs">
      <div className="text-2xl font-bold">{offerCount}</div>
      <p className="text-muted-foreground text-sm">Offers</p>
    </div>
  );
}
