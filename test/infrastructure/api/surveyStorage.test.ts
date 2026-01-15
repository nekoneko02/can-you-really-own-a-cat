/**
 * アンケートデータストレージのテスト
 * InMemorySurveyStorageを使用してインターフェースの動作を検証
 */

import { InMemorySurveyStorage } from '@/test/helpers/InMemorySurveyStorage';
import type { PreSurvey, PostSurvey } from '@/lib/api/types';

describe('InMemorySurveyStorage', () => {
  let storage: InMemorySurveyStorage;

  beforeEach(() => {
    storage = new InMemorySurveyStorage();
  });

  describe('saveStartSurvey', () => {
    it('should save start survey and return record', async () => {
      const sessionId = '550e8400-e29b-41d4-a716-446655440000';
      const scenarioSlug = 'night-crying';
      const preSurvey: PreSurvey = {
        wantToCatLevel: 3,
        expectations: ['飼育の大変さを知りたい'],
      };

      const record = await storage.saveStartSurvey(sessionId, scenarioSlug, preSurvey);

      expect(record.sessionId).toBe(sessionId);
      expect(record.scenarioSlug).toBe(scenarioSlug);
      expect(record.preSurvey).toEqual(preSurvey);
      expect(record.startedAt).toBeDefined();
      expect(record.completedAt).toBeUndefined();
      expect(record.postSurvey).toBeUndefined();
    });
  });

  describe('saveCompleteSurvey', () => {
    it('should update existing record with complete survey', async () => {
      const sessionId = '550e8400-e29b-41d4-a716-446655440000';
      const scenarioSlug = 'night-crying';
      const preSurvey: PreSurvey = {
        wantToCatLevel: 3,
      };
      const postSurvey: PostSurvey = {
        wantToCatLevel: 4,
        awareness: 'new',
        freeText: '夜泣きがこんなに続くとは思わなかった',
      };

      // 先にstartを保存
      await storage.saveStartSurvey(sessionId, scenarioSlug, preSurvey);

      // completeを保存
      const record = await storage.saveCompleteSurvey(sessionId, postSurvey);

      expect(record).not.toBeNull();
      expect(record?.sessionId).toBe(sessionId);
      expect(record?.preSurvey).toEqual(preSurvey);
      expect(record?.postSurvey).toEqual(postSurvey);
      expect(record?.completedAt).toBeDefined();
    });

    it('should return null if start record not found', async () => {
      const sessionId = '550e8400-e29b-41d4-a716-446655440000';
      const postSurvey: PostSurvey = {
        wantToCatLevel: 4,
        awareness: 'new',
      };

      const record = await storage.saveCompleteSurvey(sessionId, postSurvey);

      expect(record).toBeNull();
    });
  });

  describe('findBySessionId', () => {
    it('should return record if found', async () => {
      const sessionId = '550e8400-e29b-41d4-a716-446655440000';
      const scenarioSlug = 'night-crying';
      const preSurvey: PreSurvey = {
        wantToCatLevel: 3,
      };

      await storage.saveStartSurvey(sessionId, scenarioSlug, preSurvey);

      const record = await storage.findBySessionId(sessionId);

      expect(record).not.toBeNull();
      expect(record?.sessionId).toBe(sessionId);
    });

    it('should return null if not found', async () => {
      const record = await storage.findBySessionId('nonexistent');

      expect(record).toBeNull();
    });
  });
});
