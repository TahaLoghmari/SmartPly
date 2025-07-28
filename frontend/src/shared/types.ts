export interface BulkDeleteRequestDto {
  Ids: string[];
}

export interface ProblemDetails {
  detail?: string;
  errors?: Record<string, unknown>;
  requestedId: string;
  status: number;
  title?: string;
  traceId: string;
  type?: string;
}
