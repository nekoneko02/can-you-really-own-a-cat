/**
 * DynamoDBSurveyStorage のテスト
 */

import { DynamoDBSurveyStorage } from '@/lib/data/DynamoDBSurvey';
import type { PreSurvey, PostSurvey } from '@/lib/api/types';

// amplifyDataClientのモック
jest.mock('@/lib/data/amplifyDataClient', () => ({
  getDataClient: jest.fn(),
}));

import { getDataClient } from '@/lib/data/amplifyDataClient';

const mockGetDataClient = getDataClient as jest.MockedFunction<typeof getDataClient>;

describe('DynamoDBSurveyStorage', () => {
  let storage: DynamoDBSurveyStorage;
  let mockClient: {
    models: {
      Survey: {
        create: jest.Mock;
        get: jest.Mock;
        update: jest.Mock;
      };
    };
  };

  beforeEach(() => {
    storage = new DynamoDBSurveyStorage();
    mockClient = {
      models: {
        Survey: {
          create: jest.fn(),
          get: jest.fn(),
          update: jest.fn(),
        },
      },
    };
    mockGetDataClient.mockReturnValue(mockClient as ReturnType<typeof getDataClient>);
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('saveStartSurvey', () => {
    const sessionId = '550e8400-e29b-41d4-a716-446655440000';
    const scenarioSlug = 'night-crying';
    const preSurvey: PreSurvey = {
      wantToCatLevel: 3,
      expectations: ['飼育の大変さを知りたい'],
    };

    it('should save start survey and return record', async () => {
      mockClient.models.Survey.create.mockResolvedValue({ data: {} });

      const record = await storage.saveStartSurvey(sessionId, scenarioSlug, preSurvey);

      expect(record.sessionId).toBe(sessionId);
      expect(record.scenarioSlug).toBe(scenarioSlug);
      expect(record.preSurvey).toEqual(preSurvey);
      expect(record.startedAt).toBeDefined();
      expect(record.completedAt).toBeUndefined();
      expect(record.postSurvey).toBeUndefined();

      expect(mockClient.models.Survey.create).toHaveBeenCalledWith({
        sessionId,
        scenarioSlug,
        preSurvey: JSON.stringify(preSurvey),
        startedAt: expect.any(String),
      });
    });

    it('should output log on success', async () => {
      mockClient.models.Survey.create.mockResolvedValue({ data: {} });

      await storage.saveStartSurvey(sessionId, scenarioSlug, preSurvey);

      expect(console.info).toHaveBeenCalled();
    });

    it('should log error but still return record on DynamoDB failure', async () => {
      mockClient.models.Survey.create.mockRejectedValue(new Error('DynamoDB error'));

      const record = await storage.saveStartSurvey(sessionId, scenarioSlug, preSurvey);

      expect(console.error).toHaveBeenCalledWith(
        'Failed to save start survey to DynamoDB:',
        expect.any(Error)
      );
      // エラー時もレコードを返す
      expect(record.sessionId).toBe(sessionId);
      expect(record.scenarioSlug).toBe(scenarioSlug);
    });
  });

  describe('saveCompleteSurvey', () => {
    const sessionId = '550e8400-e29b-41d4-a716-446655440000';
    const postSurvey: PostSurvey = {
      wantToCatLevel: 4,
      awareness: 'new',
      freeText: '夜泣きがこんなに続くとは思わなかった',
    };
    const existingRecord = {
      sessionId,
      scenarioSlug: 'night-crying',
      preSurvey: JSON.stringify({ wantToCatLevel: 3 }),
      startedAt: '2024-01-01T00:00:00.000Z',
    };

    it('should update existing record with complete survey', async () => {
      mockClient.models.Survey.get.mockResolvedValue({ data: existingRecord });
      mockClient.models.Survey.update.mockResolvedValue({
        data: {
          ...existingRecord,
          postSurvey: JSON.stringify(postSurvey),
          completedAt: '2024-01-01T01:00:00.000Z',
        },
      });

      const record = await storage.saveCompleteSurvey(sessionId, postSurvey);

      expect(record).not.toBeNull();
      expect(record?.sessionId).toBe(sessionId);
      expect(record?.postSurvey).toEqual(postSurvey);
      expect(record?.completedAt).toBeDefined();

      expect(mockClient.models.Survey.update).toHaveBeenCalledWith({
        sessionId,
        postSurvey: JSON.stringify(postSurvey),
        completedAt: expect.any(String),
      });
    });

    it('should return null if start record not found', async () => {
      mockClient.models.Survey.get.mockResolvedValue({ data: null });

      const record = await storage.saveCompleteSurvey(sessionId, postSurvey);

      expect(record).toBeNull();
      expect(console.warn).toHaveBeenCalledWith(
        `Start record not found for session: ${sessionId}`
      );
    });

    it('should return null if update fails', async () => {
      mockClient.models.Survey.get.mockResolvedValue({ data: existingRecord });
      mockClient.models.Survey.update.mockResolvedValue({ data: null });

      const record = await storage.saveCompleteSurvey(sessionId, postSurvey);

      expect(record).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        `Failed to update survey for session: ${sessionId}`
      );
    });

    it('should log error and return null on DynamoDB failure', async () => {
      mockClient.models.Survey.get.mockRejectedValue(new Error('DynamoDB error'));

      const record = await storage.saveCompleteSurvey(sessionId, postSurvey);

      expect(record).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Failed to save complete survey to DynamoDB:',
        expect.any(Error)
      );
    });
  });

  describe('findBySessionId', () => {
    const sessionId = '550e8400-e29b-41d4-a716-446655440000';
    const storedRecord = {
      sessionId,
      scenarioSlug: 'night-crying',
      preSurvey: JSON.stringify({ wantToCatLevel: 3 }),
      postSurvey: JSON.stringify({ wantToCatLevel: 4, awareness: 'new' }),
      startedAt: '2024-01-01T00:00:00.000Z',
      completedAt: '2024-01-01T01:00:00.000Z',
    };

    it('should return record if found', async () => {
      mockClient.models.Survey.get.mockResolvedValue({ data: storedRecord });

      const record = await storage.findBySessionId(sessionId);

      expect(record).not.toBeNull();
      expect(record?.sessionId).toBe(sessionId);
      expect(record?.preSurvey).toEqual({ wantToCatLevel: 3 });
      expect(record?.postSurvey).toEqual({ wantToCatLevel: 4, awareness: 'new' });
    });

    it('should return record without postSurvey if not completed', async () => {
      const incompleteRecord = {
        ...storedRecord,
        postSurvey: null,
        completedAt: null,
      };
      mockClient.models.Survey.get.mockResolvedValue({ data: incompleteRecord });

      const record = await storage.findBySessionId(sessionId);

      expect(record).not.toBeNull();
      expect(record?.postSurvey).toBeUndefined();
      expect(record?.completedAt).toBeUndefined();
    });

    it('should return null if not found', async () => {
      mockClient.models.Survey.get.mockResolvedValue({ data: null });

      const record = await storage.findBySessionId(sessionId);

      expect(record).toBeNull();
    });

    it('should log error and return null on DynamoDB failure', async () => {
      mockClient.models.Survey.get.mockRejectedValue(new Error('DynamoDB error'));

      const record = await storage.findBySessionId(sessionId);

      expect(record).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Failed to find survey in DynamoDB:',
        expect.any(Error)
      );
    });
  });
});
