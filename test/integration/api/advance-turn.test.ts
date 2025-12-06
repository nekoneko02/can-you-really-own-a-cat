/**
 * POST /api/game/advance-turn の統合テスト
 */

import { POST } from '@/app/api/game/advance-turn/route';
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
      affectionLevel: 60,
      stressLevel: 30,
      health: 80,
      hunger: 20,
    },
    save: jest.fn().mockResolvedValue(undefined),
    destroy: jest.fn(),
  }),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue(new Map()),
}));

describe('POST /api/game/advance-turn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('正常系: ターンを進める', async () => {
    const request = createTestRequest('http://localhost:3000/api/game/advance-turn', {
      method: 'POST',
    });

    const response = await POST(request);
    const data = await getResponseJSON(response);

    expect(response.status).toBe(200);
    expect(data.session).toBeDefined();
    expect(data.session.id).toBe('test-session-1');
    expect(data.session.scenarioId).toBe('scenario-1');
    expect(data.session.currentTurn).toBe(2); // 1 → 2
    expect(data.session.catId).toBe('test-cat-1');
  });
});
