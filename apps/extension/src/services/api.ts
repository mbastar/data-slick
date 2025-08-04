import { ExtractRequest, ExtractResponse } from '@data-slick/types';

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000' 
  : 'https://your-production-url.vercel.app';

export class ApiService {
  static async extractData(request: ExtractRequest): Promise<ExtractResponse> {
    const response = await fetch(`${API_BASE_URL}/api/extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json().catch(() => ({ error: 'Invalid request' }));
        throw new Error(errorData.error || 'Invalid request data');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async getCurrentTabUrl(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          
          const activeTab = tabs[0];
          if (activeTab && activeTab.url) {
            resolve(activeTab.url);
          } else {
            reject(new Error('No active tab found'));
          }
        });
      } else {
        // Fallback for development/testing
        resolve(window.location.href);
      }
    });
  }

  static validateUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      // Only allow http and https protocols for webhooks
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }
}