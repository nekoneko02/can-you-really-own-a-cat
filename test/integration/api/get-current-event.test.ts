/**
 * POST /api/game/get-current-event の統合テスト
 */

import { POST } from '@/app/api/game/get-current-event/route';
import { createTestRequest, getResponseJSON } from '../../helpers/test-server';

// iron-sessionをモック（セッションあり）
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

describe('POST /api/game/get-current-event', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('正常系: 現在のイベントを取得', async () => {
    const request = createTestRequest('http://localhost:3000/api/game/get-current-event', {
      method: 'POST',
      body: { scenarioId: 'scenario-1' },
    });

    const response = await POST(request);
    const data = await getResponseJSON(response);

    expect(response.status).toBe(200);
    expect(data.event).toBeDefined();
    expect(data.event.id).toBe('event1');
    expect(data.event.title).toBe('朝の餌やり');
    expect(data.event.description).toBeTruthy();
    expect(data.event.choices).toBeInstanceOf(Array);
    expect(data.event.choices.length).toBeGreaterThan(0);
  });

  it('異常系: scenarioIdが指定されていない', async () => {
    const request = createTestRequest('http://localhost:3000/api/game/get-current-event', {
      method: 'POST',
      body: {},
    });

    const response = await POST(request);
    const data = await getResponseJSON(response);

    expect(response.status).toBe(400);
    expect(data.error).toBe('scenarioIdが必要です');
  });
});
