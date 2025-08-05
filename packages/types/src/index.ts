export interface ExtractRequest {
  pageUrl: string;
  webhookUrl: string;
  schema: Record<string, any>;
  prompt: string;
}

export interface ExtractResponse {
  jobId: string;
}

export interface WebhookPayload {
  success: boolean;
  sourceUrl: string;
  data: Record<string, any> | null;
  error?: string;
  jobId: string;
}