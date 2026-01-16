/**
 * シナリオ体験完了APIのテスト
 */

import { POST } from '@/app/api/scenarios/[scenarioSlug]/scenario-complete/route';
import { resetSurveyStorage, setSurveyStorage } from '@/lib/api/surveyStorage';
import { InMemorySurveyStorage } from '@/test/helpers/InMemorySurveyStorage';
import { NextRequest } from 'next/server';

describe('POST /api/scenarios/[scenarioSlug]/scenario-complete', () => {
  let inMemoryStorage: InMemorySurveyStorage;

  beforeEach(() => {
    resetSurveyStorage();
    inMemoryStorage = new InMemorySurveyStorage();
    setSurveyStorage(inMemoryStorage);
  });

  const createRequest = (body: object) => {
    return new NextRequest('http://localhost:3000/api/scenarios/night-crying/scenario-complete', {
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
    it('should return 200 with scenarioCompletedAt for valid request', async () => {
      const sessionId = '550e8400-e29b-41d4-a716-446655440000';
      await setupStartRecord(sessionId);

      const request = createRequest({ sessionId });

      const response = await POST(request, {
        params: Promise.resolve({ scenarioSlug: 'night-crying' }),
      });

      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.scenarioCompletedAt).toBeDefined();
      expect(new Date(json.scenarioCompletedAt).toISOString()).toBe(json.scenarioCompletedAt);
    });

    it('should update record with scenarioCompletedAt', async () => {
      const sessionId = '550e8400-e29b-41d4-a716-446655440000';
      await setupStartRecord(sessionId);

      const request = createRequest({ sessionId });

      await POST(request, {
        params: Promise.resolve({ scenarioSlug: 'night-crying' }),
      });

      const record = await inMemoryStorage.findBySessionId(sessionId);
      expect(record?.scenarioCompletedAt).toBeDefined();
      expect(record?.completedAt).toBeUndefined();
    });
  });

  describe('validation errors', () => {
    it('should return 400 for invalid scenarioSlug', async () => {
      const sessionId = '550e8400-e29b-41d4-a716-446655440000';
      await setupStartRecord(sessionId);

      const request = createRequest({ sessionId });

      const response = await POST(request, {
        params: Promise.resolve({ scenarioSlug: 'invalid-scenario' }),
      });

      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.code).toBe('INVALID_SCENARIO');
    });

    it('should return 400 for missing sessionId', async () => {
      const request = createRequest({});

      const response = await POST(request, {
        params: Promise.resolve({ scenarioSlug: 'night-crying' }),
      });

      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.code).toBe('INVALID_SESSION_ID');
    });

    it('should return 400 for invalid sessionId format', async () => {
      const request = createRequest({
        sessionId: 'invalid-uuid',
      });

      const response = await POST(request, {
        params: Promise.resolve({ scenarioSlug: 'night-crying' }),
      });

      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.code).toBe('INVALID_SESSION_ID');
    });

    it('should return 400 for invalid JSON body', async () => {
      const request = new NextRequest('http://localhost:3000/api/scenarios/night-crying/scenario-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json',
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
