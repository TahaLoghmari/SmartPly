import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { useApplicationPageNavigationStore } from "#/applications";

export function ApplicationPageTabs() {
  const { navigationPage, setNavigationPage } =
    useApplicationPageNavigationStore();
  return (
    <div className="flex flex-1 items-center gap-4 border-b px-8 py-2">
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
        <p>Overview</p>
      </div>
      <div
        onClick={() => setNavigationPage("Documents")}
        className={`${navigationPage === "Documents" ? "bg-accent text-accent-foreground" : ""} hover:bg-accent hover:text-accent-foreground flex w-fit cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm`}
      >
        <FontAwesomeIcon icon={faFile} />
        <p>Documents</p>
      </div>
    </div>
  );
}
