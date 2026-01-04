/**
 * アンケートデータストレージのテスト
 */

import {
  SurveyStorage,
  SurveyRecord,
} from '@/lib/api/surveyStorage';
import type { PreSurvey, PostSurvey } from '@/lib/api/types';

describe('SurveyStorage', () => {
  let storage: SurveyStorage;

  beforeEach(() => {
    storage = new SurveyStorage();
    // コンソール出力を抑制
    jest.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('saveStartSurvey', () => {
    it('should save start survey and return record', () => {
      const sessionId = '550e8400-e29b-41d4-a716-446655440000';
      const scenarioSlug = 'night-crying';
      const preSurvey: PreSurvey = {
        wantToCatLevel: 3,
        expectations: ['飼育の大変さを知りたい'],
      };

      const record = storage.saveStartSurvey(sessionId, scenarioSlug, preSurvey);

      expect(record.sessionId).toBe(sessionId);
      expect(record.scenarioSlug).toBe(scenarioSlug);
      expect(record.preSurvey).toEqual(preSurvey);
      expect(record.startedAt).toBeDefined();
      expect(record.completedAt).toBeUndefined();
      expect(record.postSurvey).toBeUndefined();
    });

    it('should output log', () => {
      const sessionId = '550e8400-e29b-41d4-a716-446655440000';
      const scenarioSlug = 'night-crying';
      const preSurvey: PreSurvey = {
        wantToCatLevel: 3,
      };

      storage.saveStartSurvey(sessionId, scenarioSlug, preSurvey);

      expect(console.info).toHaveBeenCalled();
    });
  });

  describe('saveCompleteSurvey', () => {
    it('should update existing record with complete survey', () => {
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
      storage.saveStartSurvey(sessionId, scenarioSlug, preSurvey);

      // completeを保存
      const record = storage.saveCompleteSurvey(sessionId, postSurvey);

      expect(record).not.toBeNull();
      expect(record?.sessionId).toBe(sessionId);
      expect(record?.preSurvey).toEqual(preSurvey);
      expect(record?.postSurvey).toEqual(postSurvey);
      expect(record?.completedAt).toBeDefined();
    });

    it('should return null if start record not found', () => {
      const sessionId = '550e8400-e29b-41d4-a716-446655440000';
      const postSurvey: PostSurvey = {
        wantToCatLevel: 4,
        awareness: 'new',
      };

      const record = storage.saveCompleteSurvey(sessionId, postSurvey);

      expect(record).toBeNull();
    });
  });

  describe('findBySessionId', () => {
    it('should return record if found', () => {
      const sessionId = '550e8400-e29b-41d4-a716-446655440000';
      const scenarioSlug = 'night-crying';
      const preSurvey: PreSurvey = {
        wantToCatLevel: 3,
      };

      storage.saveStartSurvey(sessionId, scenarioSlug, preSurvey);

      const record = storage.findBySessionId(sessionId);

      expect(record).not.toBeNull();
      expect(record?.sessionId).toBe(sessionId);
    });

    it('should return null if not found', () => {
      const record = storage.findBySessionId('nonexistent');

      expect(record).toBeNull();
    });
  });
});
