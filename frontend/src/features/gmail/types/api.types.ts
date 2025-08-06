export interface GmailMessagePartBody {
  attachmentId?: string;
  data?: string;
  size?: number;
  ETag?: string;
}

export interface GmailMessagePartHeader {
  name?: string;
  value?: string;
  ETag?: string;
}

export interface GmailMessagePart {
  partId?: string;
  mimeType?: string;
  filename?: string;
  headers?: GmailMessagePartHeader[];
  body?: GmailMessagePartBody;
  parts?: GmailMessagePart[];
  ETag?: string;
}

export interface GmailMessage {
  id?: string;
  threadId?: string;
  labelIds?: string[];
  snippet?: string;
  historyId?: string;
  internalDate?: string;
  payload?: GmailMessagePart;
  sizeEstimate?: number;
  raw?: string;
  ETag?: string;
}
