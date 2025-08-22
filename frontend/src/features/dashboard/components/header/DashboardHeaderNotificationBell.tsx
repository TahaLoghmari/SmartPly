import { useGetNotifications } from "#/notifications";
import { NavLink } from "react-router-dom";

export default function DashboardHeaderNotificationBell() {
  const { data: notifications } = useGetNotifications();
  const allNotifications =
    notifications?.pages.flatMap((page) => page.items) ?? [];
  const totalUnreadNotifications = allNotifications.filter(
    (n) => n.isRead === false,
  ).length;
  return (
    <NavLink
      to={`/app/notifications`}
      className="hover:text-accent-foreground relative flex h-8 cursor-pointer items-center rounded-md px-2 hover:bg-gray-200"
    >
      {({ isActive }) => (
        <>
          {!isActive ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160ZM480-80q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80Z" />
            </svg>
          )}
          {totalUnreadNotifications > 0 && (
            <span
              className="bg-primary text-primary-foreground absolute -top-1 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full px-1 text-xs font-bold"
              aria-label={`${totalUnreadNotifications} unread notifications`}
            >
              {totalUnreadNotifications}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}
