export interface Email {
  id: string;
  userId: string;
  internalDate?: number | null;
  headerDate?: string | null;
  subject: string;
  fromAddress: string;
  fromName: string;
  labels: string;
  snippet: string;
  isRead: boolean;
  isImportant: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MessagePartBody {
  attachmentId?: string;
  data?: string;
  size?: number;
  ETag?: string;
}

export interface MessagePartHeader {
  name?: string;
  value?: string;
  ETag?: string;
}

export interface MessagePart {
  partId?: string;
  mimeType?: string;
  filename?: string;
  headers?: MessagePartHeader[];
  body?: MessagePartBody;
  parts?: MessagePart[];
  ETag?: string;
}

export interface Message {
  id?: string;
  threadId?: string;
  labelIds?: string[];
  snippet?: string;
  historyId?: string;
  internalDate?: string;
  payload?: MessagePart;
  sizeEstimate?: number;
  raw?: string;
  ETag?: string;
}

export interface EmailQueryParameters {
  page: number;
  pageSize: number;
}
