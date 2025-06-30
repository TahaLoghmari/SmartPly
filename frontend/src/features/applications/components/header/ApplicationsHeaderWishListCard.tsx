import { useApplicationsWishListCountStore } from "#/applications";

export function ApplicationsHeaderWishListCard() {
  const { wishListCount } = useApplicationsWishListCountStore();
  return (
    <div className="bg-card text-card-foreground rounded-lg border p-4 shadow-xs">
      <div className="text-2xl font-bold">{wishListCount}</div>
      <p className="text-muted-foreground text-sm">Wishlist</p>
    </div>
  );
}
