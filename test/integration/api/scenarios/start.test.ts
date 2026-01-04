/**
 * シナリオ開始APIのテスト
 */

import { POST } from '@/app/api/scenarios/[scenarioSlug]/start/route';
import { resetSurveyStorage } from '@/lib/api/surveyStorage';
import { NextRequest } from 'next/server';

describe('POST /api/scenarios/[scenarioSlug]/start', () => {
  beforeEach(() => {
    resetSurveyStorage();
  });

  const createRequest = (body: object) => {
    return new NextRequest('http://localhost:3000/api/scenarios/night-crying/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  };

  describe('successful requests', () => {
    it('should return 201 with startedAt for valid request', async () => {
      const request = createRequest({
        sessionId: '550e8400-e29b-41d4-a716-446655440000',
        preSurvey: {
          wantToCatLevel: 3,
          expectations: ['飼育の大変さを知りたい'],
        },
      });

      const response = await POST(request, {
        params: Promise.resolve({ scenarioSlug: 'night-crying' }),
      });

      expect(response.status).toBe(201);

      const json = await response.json();
      expect(json.success).toBe(true);
      expect(json.startedAt).toBeDefined();
      expect(new Date(json.startedAt).toISOString()).toBe(json.startedAt);
    });

    it('should accept request without optional expectations', async () => {
      const request = createRequest({
        sessionId: '550e8400-e29b-41d4-a716-446655440000',
        preSurvey: {
          wantToCatLevel: 1,
        },
      });

      const response = await POST(request, {
        params: Promise.resolve({ scenarioSlug: 'night-crying' }),
      });

      expect(response.status).toBe(201);
    });
  });

  describe('validation errors', () => {
    it('should return 400 for invalid scenarioSlug', async () => {
      const request = createRequest({
        sessionId: '550e8400-e29b-41d4-a716-446655440000',
        preSurvey: {
          wantToCatLevel: 3,
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
        preSurvey: {
          wantToCatLevel: 3,
        },
      });

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
        preSurvey: {
          wantToCatLevel: 3,
        },
      });

      const response = await POST(request, {
        params: Promise.resolve({ scenarioSlug: 'night-crying' }),
      });

      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.code).toBe('INVALID_SESSION_ID');
    });

    it('should return 400 for invalid wantToCatLevel', async () => {
      const request = createRequest({
        sessionId: '550e8400-e29b-41d4-a716-446655440000',
        preSurvey: {
          wantToCatLevel: 6,
        },
      });

      const response = await POST(request, {
        params: Promise.resolve({ scenarioSlug: 'night-crying' }),
      });

      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for invalid expectations', async () => {
      const request = createRequest({
        sessionId: '550e8400-e29b-41d4-a716-446655440000',
        preSurvey: {
          wantToCatLevel: 3,
          expectations: ['invalid expectation'],
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
});
