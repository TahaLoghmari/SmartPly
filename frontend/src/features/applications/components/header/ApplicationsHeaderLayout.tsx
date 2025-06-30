import {
  ApplicationsHeaderAppliedCard,
  ApplicationsHeaderGhostedCard,
  ApplicationsHeaderInterviewingCard,
  ApplicationsHeaderOfferCard,
  ApplicationsHeaderRejectedCard,
  ApplicationsHeaderWishListCard,
} from "./index";

export function ApplicationsHeaderLayout() {
  return (
    <div className="grid grid-cols-1 gap-4 transition-all duration-300 md:grid-cols-2 lg:grid-cols-6">
      <ApplicationsHeaderWishListCard />
      <ApplicationsHeaderAppliedCard />
      <ApplicationsHeaderInterviewingCard />
      <ApplicationsHeaderOfferCard />
      <ApplicationsHeaderRejectedCard />
      <ApplicationsHeaderGhostedCard />
    </div>
  );
}
