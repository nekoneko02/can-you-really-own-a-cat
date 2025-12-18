/**
 * POST /api/game/is-complete の統合テスト
 */

import { POST } from '@/app/api/game/is-complete/route';
import { createTestRequest, getResponseJSON } from '../../helpers/test-server';

// iron-sessionのモック（全テストケースで共通）
let mockSession: any = {
  gameSession: {
    id: 'test-session-1',
    scenarioId: 'scenario-1',
    currentTurn: 1,
    catId: 'test-cat-1',
  },
  save: jest.fn().mockResolvedValue(undefined),
  destroy: jest.fn(),
};

jest.mock('iron-session', () => ({
  getIronSession: jest.fn().mockImplementation(() => Promise.resolve(mockSession)),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue(new Map()),
}));

describe('POST /api/game/is-complete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // デフォルトはターン1
    mockSession.gameSession.currentTurn = 1;
  });

  it('正常系: シナリオが完了していない（ターン1）', async () => {
    // ターン1のセッション（デフォルト値）
    mockSession.gameSession.currentTurn = 1;

    const request = createTestRequest('http://localhost:3000/api/game/is-complete', {
      method: 'POST',
      body: { scenarioId: 'scenario-1' },
    });

    const response = await POST(request);
    const data = await getResponseJSON(response);

    expect(response.status).toBe(200);
    expect(data.isComplete).toBe(false);
  });

  it('正常系: シナリオが完了（ターン4）', async () => {
    // ターン4のセッション（3イベントなので完了）
    mockSession.gameSession.currentTurn = 4;

    const request = createTestRequest('http://localhost:3000/api/game/is-complete', {
      method: 'POST',
      body: { scenarioId: 'scenario-1' },
    });

    const response = await POST(request);
    const data = await getResponseJSON(response);

    expect(response.status).toBe(200);
    expect(data.isComplete).toBe(true);
  });

  it('異常系: scenarioIdが指定されていない', async () => {
    const request = createTestRequest('http://localhost:3000/api/game/is-complete', {
      method: 'POST',
      body: {},
    });

    const response = await POST(request);
    const data = await getResponseJSON(response);

    expect(response.status).toBe(400);
    expect(data.error).toBe('scenarioIdが必要です');
  });
});
