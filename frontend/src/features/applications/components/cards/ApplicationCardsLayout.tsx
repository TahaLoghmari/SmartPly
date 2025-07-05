import {
  useApplicationStore,
  ApplicationCard,
  type ApplicationCreateResponseDto,
} from "#/applications";

export function ApplicationCardsLayout() {
  const { applicationCardsState } = useApplicationStore();
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {applicationCardsState.map(
        (applicationCard: ApplicationCreateResponseDto) => (
          <ApplicationCard
            applicationCard={applicationCard}
            key={applicationCard.id}
          />
        ),
      )}
    </div>
  );
}
