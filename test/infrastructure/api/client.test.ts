/**
 * APIクライアントのテスト
 */

import { surveyApiClient } from '@/lib/api/client';
import type { PreSurvey } from '@/lib/api/types';

describe('surveyApiClient', () => {
  const mockFetch = jest.fn();
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('startScenario', () => {
    const sessionId = '12345678-1234-4123-8123-123456789abc';
    const preSurvey: PreSurvey = {
      wantToCatLevel: 3,
      expectations: ['飼育の大変さを知りたい'],
    };

    it('正常にAPIを呼び出し、レスポンスを返す', async () => {
      const mockResponse = {
        success: true,
        startedAt: '2026-01-04T12:00:00Z',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await surveyApiClient.startScenario(
        'night-crying',
        sessionId,
        preSurvey
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/scenarios/night-crying/start',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            preSurvey,
          }),
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('APIがエラーレスポンスを返した場合、例外をスローする', async () => {
      const mockError = {
        error: 'Invalid request',
        code: 'VALIDATION_ERROR',
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => mockError,
      });

      await expect(
        surveyApiClient.startScenario('night-crying', sessionId, preSurvey)
      ).rejects.toThrow('Invalid request');
    });

    it('ネットワークエラーの場合、例外をスローする', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        surveyApiClient.startScenario('night-crying', sessionId, preSurvey)
      ).rejects.toThrow('Network error');
    });
  });
});
