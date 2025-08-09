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

export const extractEmail = (fromHeader: string): string => {
  const emailMatch = fromHeader.match(/<([^>]+)>/);
  return emailMatch ? emailMatch[1] : fromHeader;
};

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

export function formatEmailDisplay(dateRaw?: string) {
  if (!dateRaw) return "";
  const date = new Date(dateRaw);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  let rel: string;
  if (minutes < 1) {
    rel = "Just now";
  } else if (minutes < 60) {
    rel = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (days < 1) {
    rel = `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (weeks < 1) {
    rel = `${days} day${days > 1 ? "s" : ""} ago`;
  } else {
    rel = `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }

  if (isSameDay) {
    return `${time} (${rel})`;
  }

  const weekday = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
  }).format(date);
  const month = new Intl.DateTimeFormat(undefined, { month: "short" }).format(
    date,
  );
  const dayNum = date.getDate();
  return `${weekday},${month} ${dayNum}, ${time} (${rel})`;
}

export function decodeHtmlEntities(str: string | undefined) {
  if (str == undefined) return;
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

export function getEmailBody(payload: EmailPart | undefined) {
  if (!payload) return "";

  const base64UrlToBytes = (data: string) => {
    let base64 = data.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) base64 += "=".repeat(4 - pad);
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  };

  const getCharset = (headers?: any[]) => {
    const ct =
      headers?.find((h) => h.name?.toLowerCase() === "content-type")?.value ||
      "";
    const m = ct.match(/charset=([^;]+)/i);
    return m?.[1]?.trim().replace(/^"|"$/g, "") || "utf-8";
  };

  const parts = payload.parts;
  const htmlPart = parts?.find((p: any) =>
    p.mimeType?.toLowerCase().startsWith("text/html"),
  );
  const plainPart = parts?.find((p: any) =>
    p.mimeType?.toLowerCase().startsWith("text/plain"),
  );

  let data =
    htmlPart?.body?.data ?? payload.body?.data ?? plainPart?.body?.data ?? "";

  if (!data) return "";

  const charset =
    getCharset((htmlPart as any)?.headers) ||
    getCharset((payload as any)?.headers) ||
    "utf-8";
  let text = "";
  try {
    const bytes = base64UrlToBytes(data);
    const decoder = new TextDecoder(charset.toLowerCase(), { fatal: false });
    text = decoder.decode(bytes);
  } catch (e) {
    try {
      text = atob(data.replace(/-/g, "+").replace(/_/g, "/"));
    } catch {
      return "";
    }
  }

  text = text.replace(/[\u200B-\u200D\uFEFF]/g, "");

  if (!htmlPart && plainPart) {
    const escape = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<pre style="white-space:pre-wrap;word-wrap:break-word;">${escape(
      text,
    )}</pre>`;
  }

  return text;
}
