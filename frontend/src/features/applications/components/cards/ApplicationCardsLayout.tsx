import {
  useApplicationCardsStore,
  ApplicationCard,
  type ApplicationCardType,
} from "#/applications";

export function ApplicationCardsLayout() {
  const { applicationCardsState } = useApplicationCardsStore();
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {applicationCardsState.map((applicationCard: ApplicationCardType) => (
        <ApplicationCard
          applicationCard={applicationCard}
          key={applicationCard.id}
        />
      ))}
    </div>
  );
}
