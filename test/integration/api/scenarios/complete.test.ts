/**
 * シナリオ完了APIのテスト
 */

import { POST } from '@/app/api/scenarios/[scenarioSlug]/complete/route';
import { resetSurveyStorage, setSurveyStorage } from '@/lib/api/surveyStorage';
import { InMemorySurveyStorage } from '@/test/helpers/InMemorySurveyStorage';
import { NextRequest } from 'next/server';

describe('POST /api/scenarios/[scenarioSlug]/complete', () => {
  let inMemoryStorage: InMemorySurveyStorage;

  beforeEach(() => {
    resetSurveyStorage();
    inMemoryStorage = new InMemorySurveyStorage();
    setSurveyStorage(inMemoryStorage);
  });

  const createRequest = (body: object) => {
    return new NextRequest('http://localhost:3000/api/scenarios/night-crying/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  };

  const setupStartRecord = async (sessionId: string) => {
    await inMemoryStorage.saveStartSurvey(sessionId, 'night-crying', {
      wantToCatLevel: 3,
      expectations: ['飼育の大変さを知りたい'],
    });
  };

  describe('successful requests', () => {
    it('should return 200 with completedAt for valid request', async () => {
      const sessionId = '550e8400-e29b-41d4-a716-446655440000';
      await setupStartRecord(sessionId);

      const request = createRequest({
        sessionId,
        postSurvey: {
          wantToCatLevel: 4,
          awareness: 'new',
          freeText: '夜泣きがこんなに続くとは思わなかった',
        },
      });

      const response = await POST(request, {
        params: Promise.resolve({ scenarioSlug: 'night-crying' }),
      });

      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.completedAt).toBeDefined();
      expect(new Date(json.completedAt).toISOString()).toBe(json.completedAt);
    });

    it('should accept request without optional freeText', async () => {
      const sessionId = '550e8400-e29b-41d4-a716-446655440000';
      await setupStartRecord(sessionId);

      const request = createRequest({
        sessionId,
        postSurvey: {
          wantToCatLevel: 4,
          awareness: 'realized',
        },
      });

      const response = await POST(request, {
        params: Promise.resolve({ scenarioSlug: 'night-crying' }),
      });

      expect(response.status).toBe(200);
    });
  });

  describe('validation errors', () => {
    it('should return 400 for invalid scenarioSlug', async () => {
      const sessionId = '550e8400-e29b-41d4-a716-446655440000';
      await setupStartRecord(sessionId);

      const request = createRequest({
        sessionId,
        postSurvey: {
          wantToCatLevel: 4,
          awareness: 'new',
        },
      });

      const response = await POST(request, {
        params: Promise.resolve({ scenarioSlug: 'invalid-scenario' }),
      });

      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.code).toBe('INVALID_SCENARIO');
    });

    it('should return 400 for missing sessionId', async () => {
      const request = createRequest({
        postSurvey: {
          wantToCatLevel: 4,
          awareness: 'new',
        },
      });

      const response = await POST(request, {
        params: Promise.resolve({ scenarioSlug: 'night-crying' }),
      });

      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.code).toBe('INVALID_SESSION_ID');
    });

    it('should return 400 for invalid awareness', async () => {
      const sessionId = '550e8400-e29b-41d4-a716-446655440000';
      await setupStartRecord(sessionId);

      const request = createRequest({
        sessionId,
        postSurvey: {
          wantToCatLevel: 4,
          awareness: 'invalid',
        },
      });

      const response = await POST(request, {
        params: Promise.resolve({ scenarioSlug: 'night-crying' }),
      });

      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for freeText exceeding limit', async () => {
      const sessionId = '550e8400-e29b-41d4-a716-446655440000';
      await setupStartRecord(sessionId);

      const request = createRequest({
        sessionId,
        postSurvey: {
          wantToCatLevel: 4,
          awareness: 'new',
          freeText: 'a'.repeat(1001),
        },
      });

      const response = await POST(request, {
        params: Promise.resolve({ scenarioSlug: 'night-crying' }),
      });

      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('404 errors', () => {
    it('should return 404 when start record not found', async () => {
      const request = createRequest({
        sessionId: '550e8400-e29b-41d4-a716-446655440000',
        postSurvey: {
          wantToCatLevel: 4,
          awareness: 'new',
        },
      });

      const response = await POST(request, {
        params: Promise.resolve({ scenarioSlug: 'night-crying' }),
      });

      expect(response.status).toBe(404);

      const json = await response.json();
      expect(json.code).toBe('SESSION_NOT_FOUND');
    });
  });
});
