import type { EmailPart } from "#/inbox";

export function getHeader(headers: any[] | undefined, name: string) {
  return (
    headers?.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value ||
    ""
  );
}
export function getSenderName(from: string) {
  if (!from) return "";
  let name = from.replace(/^"+|"+$/g, "").trim();
  const idx = name.indexOf("<");
  if (idx !== -1) {
    name = name.slice(0, idx).trim();
  }
  return name.replace(/^"+|"+$/g, "").trim();
}

export function formatEmailDate(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else {
    return date.toLocaleDateString([], { day: "2-digit", month: "short" });
  }
}

export function decodeHtmlEntities(str: string | undefined) {
  if (str == undefined) return;
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

export function getEmailBody(payload: EmailPart | undefined) {
  if (!payload) return "";

  let bodyData = "";
  const parts = payload.parts;

  if (payload.body?.data) {
    bodyData = payload.body.data;
  } else if (parts) {
    const htmlPart = parts.find((part) => part.mimeType === "text/html");
    if (htmlPart && htmlPart.body?.data) {
      bodyData = htmlPart.body.data;
    } else {
      const plainPart = parts.find((part) => part.mimeType === "text/plain");
      if (plainPart && plainPart.body?.data) {
        bodyData = plainPart.body.data;
      }
    }
  }

  if (bodyData) {
    // Decode URL-safe Base64
    const base64 = bodyData.replace(/-/g, "+").replace(/_/g, "/");
    try {
      return atob(base64);
    } catch (e) {
      console.error("Failed to decode Base64 string:", e);
      return "";
    }
  }

  return "";
}
