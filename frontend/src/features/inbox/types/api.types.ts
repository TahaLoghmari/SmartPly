export interface EmailPartBody {
  attachmentId?: string;
  data?: string;
  size?: number;
  ETag?: string;
}

export interface EmailPartHeader {
  name?: string;
  value?: string;
  ETag?: string;
}

export interface EmailPart {
  partId?: string;
  mimeType?: string;
  filename?: string;
  headers?: EmailPartHeader[];
  body?: EmailPartBody;
  parts?: EmailPart[];
  ETag?: string;
}

export interface Email {
  id?: string;
  threadId?: string;
  labelIds?: string[];
  snippet?: string;
  historyId?: string;
  internalDate?: string;
  payload?: EmailPart;
  sizeEstimate?: number;
  raw?: string;
  ETag?: string;
}

export interface PaginatedEmailResponse {
  messages: Email[];
  nextPageToken: string;
}
