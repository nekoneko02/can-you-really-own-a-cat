/**
 * POST /api/game/execute-choice の統合テスト
 */

import { POST } from '@/app/api/game/execute-choice/route';
import { createTestRequest, getResponseJSON } from '../../helpers/test-server';

jest.mock('iron-session', () => ({
  getIronSession: jest.fn().mockResolvedValue({
    gameSession: {
      id: 'test-session-1',
      scenarioId: 'scenario-1',
      currentTurn: 1,
      catId: 'test-cat-1',
    },
    cat: {
      id: 'test-cat-1',
      name: 'たま',
      affectionLevel: 50,
      stressLevel: 30,
      health: 80,
      hunger: 50,
    },
    save: jest.fn().mockResolvedValue(undefined),
    destroy: jest.fn(),
  }),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue(new Map()),
}));

describe('POST /api/game/execute-choice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('正常系: 選択肢を実行してCatを更新', async () => {
    const request = createTestRequest('http://localhost:3000/api/game/execute-choice', {
      method: 'POST',
      body: { scenarioId: 'scenario-1', choiceId: 'feed' },
    });

    const response = await POST(request);
    const data = await getResponseJSON(response);

    expect(response.status).toBe(200);
    expect(data.cat).toBeDefined();
    expect(data.cat.id).toBe('test-cat-1');
    expect(data.cat.name).toBe('たま');
    // 餌をやる: affection +10, hunger -30
    expect(data.cat.affectionLevel).toBe(60); // 50 + 10
    expect(data.cat.hunger).toBe(20); // 50 - 30
  });

  it('異常系: scenarioIdまたはchoiceIdが指定されていない', async () => {
    const request = createTestRequest('http://localhost:3000/api/game/execute-choice', {
      method: 'POST',
      body: { scenarioId: 'scenario-1' },
    });

    const response = await POST(request);
    const data = await getResponseJSON(response);

    expect(response.status).toBe(400);
    expect(data.error).toBe('scenarioIdとchoiceIdが必要です');
  });
});
