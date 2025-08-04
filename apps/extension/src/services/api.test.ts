import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiService } from './api'

// Mock fetch globally
global.fetch = vi.fn()

describe('ApiService', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('validateUrl', () => {
    it('validates correct HTTP URLs', () => {
      expect(ApiService.validateUrl('http://example.com')).toBe(true)
      expect(ApiService.validateUrl('https://example.com')).toBe(true)
    })

    it('rejects invalid URLs', () => {
      expect(ApiService.validateUrl('not-a-url')).toBe(false)
      expect(ApiService.validateUrl('ftp://example.com')).toBe(false)
      expect(ApiService.validateUrl('')).toBe(false)
    })
  })

  describe('extractData', () => {
    it('makes POST request with correct data', async () => {
      const mockResponse = { jobId: 'test-job-id' }
      ;(fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const request = {
        pageUrl: 'https://example.com',
        webhookUrl: 'https://webhook.com',
        schema: { title: 'string' },
        prompt: 'Extract title'
      }

      const result = await ApiService.extractData(request)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/extract'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request)
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('throws error on failed request', async () => {
      ;(fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      const request = {
        pageUrl: 'https://example.com',
        webhookUrl: 'https://webhook.com',
        schema: { title: 'string' },
        prompt: 'Extract title'
      }

      await expect(ApiService.extractData(request)).rejects.toThrow('HTTP error! status: 500')
    })
  })
})