import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { useApplicationPageNavigationStore } from "#/applications";
import { useCurrentScreenSize } from "@/index";

export default function ApplicationPageTabs() {
  const { navigationPage, setNavigationPage } =
    useApplicationPageNavigationStore();
  const { currentScreenSize } = useCurrentScreenSize();
  return (
    <div className="flex items-center gap-4 border-b px-8 py-2">
      <div
        onClick={() => setNavigationPage("Overview")}
        className={`${navigationPage === "Overview" ? "bg-accent text-accent-foreground" : ""} hover:bg-accent hover:text-accent-foreground flex w-fit cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          className="h-4 w-4"
          fill="currentColor"
        >
          <path d="M160-120q-33 0-56.5-23.5T80-200v-440q0-33 23.5-56.5T160-720h160v-80q0-33 23.5-56.5T400-880h160q33 0 56.5 23.5T640-800v80h160q33 0 56.5 23.5T880-640v440q0 33-23.5 56.5T800-120H160Zm240-600h160v-80H400v80Z" />
        </svg>
        <p
          className={`${navigationPage === "Overview" ? "" : "hidden sm:inline"}`}
        >
          Overview
        </p>
      </div>
      <div
        onClick={() => setNavigationPage("Documents")}
        className={`${navigationPage === "Documents" ? "bg-accent text-accent-foreground" : ""} hover:bg-accent hover:text-accent-foreground flex w-fit cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm`}
      >
        <FontAwesomeIcon icon={faFile} />
        <p
          className={`${navigationPage === "Documents" ? "" : "hidden sm:inline"}`}
        >
          Documents
        </p>
      </div>
      {currentScreenSize < 1024 && (
        <div
          onClick={() => setNavigationPage("Status")}
          className={`${navigationPage === "Status" ? "bg-accent text-accent-foreground" : ""} hover:bg-accent hover:text-accent-foreground flex w-fit cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            className="h-4 w-4"
            fill="currentColor"
          >
            <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
          </svg>
          <p
            className={`${navigationPage === "Status" ? "" : "hidden sm:inline"}`}
          >
            Status
          </p>
        </div>
      )}
    </div>
  );
}
