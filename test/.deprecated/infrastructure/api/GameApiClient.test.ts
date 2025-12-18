import { GameApiClient } from '@/infrastructure/api/GameApiClient';

// fetchをモック
global.fetch = jest.fn();

describe('GameApiClient', () => {
  let client: GameApiClient;

  beforeEach(() => {
    client = new GameApiClient();
    jest.clearAllMocks();
  });

  describe('loadScenario', () => {
    it('正しいエンドポイントにPOSTリクエストを送信する', async () => {
      const mockResponse = {
        scenario: {
          id: 'scenario-1',
          name: 'テストシナリオ',
          purpose: 'テスト用',
          duration: 3,
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.loadScenario('scenario-1');

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/game/load-scenario',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ scenarioId: 'scenario-1' }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('レスポンスがokでない場合、エラーをスローする', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(client.loadScenario('invalid')).rejects.toThrow('Failed to load scenario');
    });
  });

  describe('getCurrentEvent', () => {
    it('正しいエンドポイントにPOSTリクエストを送信する', async () => {
      const mockEvent = {
        id: 'event1',
        title: 'テストイベント',
        description: 'テスト説明',
        choices: [{ id: 'choice1', text: '選択肢1' }],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ event: mockEvent }),
      });

      const result = await client.getCurrentEvent('scenario-1');

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/game/get-current-event',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ scenarioId: 'scenario-1' }),
        })
      );
      expect(result).toEqual(mockEvent);
    });

    it('レスポンスがokでない場合、エラーをスローする', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(client.getCurrentEvent('scenario-1')).rejects.toThrow(
        'Failed to get current event'
      );
    });
  });

  describe('executeChoice', () => {
    it('正しいエンドポイントにPOSTリクエストを送信する', async () => {
      const mockCat = {
        id: 'cat-1',
        name: 'たま',
        affectionLevel: 50,
        stressLevel: 30,
        health: 80,
        hunger: 20,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ cat: mockCat }),
      });

      const result = await client.executeChoice('scenario-1', 'choice1');

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/game/execute-choice',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ scenarioId: 'scenario-1', choiceId: 'choice1' }),
        })
      );
      expect(result).toEqual(mockCat);
    });
  });

  describe('advanceToNextTurn', () => {
    it('正しいエンドポイントにPOSTリクエストを送信する', async () => {
      const mockSession = {
        id: 'session-1',
        scenarioId: 'scenario-1',
        currentTurn: 2,
        catId: 'cat-1',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ session: mockSession }),
      });

      const result = await client.advanceToNextTurn();

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/game/advance-turn',
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(result).toEqual(mockSession);
    });
  });

  describe('isScenarioComplete', () => {
    it('シナリオが完了している場合、trueを返す', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ isComplete: true }),
      });

      const result = await client.isScenarioComplete('scenario-1');

      expect(result).toBe(true);
    });

    it('シナリオが完了していない場合、falseを返す', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ isComplete: false }),
      });

      const result = await client.isScenarioComplete('scenario-1');

      expect(result).toBe(false);
    });
  });
});
