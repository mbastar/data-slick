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
  jobId: string;
  status: 'completed' | 'failed';
  data?: Record<string, any>;
  error?: string;
  metadata: {
    pageUrl: string;
    extractedAt: string;
    processingTimeMs: number;
  };
}