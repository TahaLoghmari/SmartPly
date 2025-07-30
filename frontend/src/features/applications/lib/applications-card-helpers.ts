import { steps } from "#/applications";

export function capitalize(status: string) {
  return status[0].toUpperCase() + status.slice(1);
}

export function uncapitalize(status: string) {
  return status[0].toLowerCase() + status.slice(1);
}

export function getStepsWithLastStatus(status: string) {
  return status === "rejected" || status === "ghosted"
    ? [...steps, "Offer", capitalize(status)]
    : [...steps, "Offer"];
}

export function formatDate(date: Date) {
  if (date instanceof Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() % 100;
    return `${day}/${month}/${year}`;
  }
  return typeof date === "string" ? date : "";
}
