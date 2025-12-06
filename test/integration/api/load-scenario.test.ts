/**
 * POST /api/game/load-scenario の統合テスト
 */

import { POST } from '@/app/api/game/load-scenario/route';
import { createTestRequest, getResponseJSON } from '../../helpers/test-server';

// iron-sessionをモック
jest.mock('iron-session', () => ({
  getIronSession: jest.fn().mockResolvedValue({
    gameSession: undefined,
    cat: undefined,
    save: jest.fn().mockResolvedValue(undefined),
    destroy: jest.fn(),
  }),
}));

// next/headersをモック
jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue(new Map()),
}));

describe('POST /api/game/load-scenario', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('正常系: シナリオを読み込んでセッション初期化', async () => {
    const request = createTestRequest('http://localhost:3000/api/game/load-scenario', {
      method: 'POST',
      body: { scenarioId: 'scenario-1' },
    });

    const response = await POST(request);
    const data = await getResponseJSON(response);

    expect(response.status).toBe(200);
    expect(data.scenario).toBeDefined();
    expect(data.scenario.id).toBe('scenario-1');
    expect(data.scenario.name).toBe('日常のお世話の継続性');
    expect(data.scenario.purpose).toBe('毎日のお世話を続けられるか気づかせる');
    expect(data.scenario.duration).toBe(3);
  });

  it('異常系: scenarioIdが指定されていない', async () => {
    const request = createTestRequest('http://localhost:3000/api/game/load-scenario', {
      method: 'POST',
      body: {},
    });

    const response = await POST(request);
    const data = await getResponseJSON(response);

    expect(response.status).toBe(400);
    expect(data.error).toBe('scenarioIdが必要です');
  });

  it('異常系: scenarioIdが不正', async () => {
    const request = createTestRequest('http://localhost:3000/api/game/load-scenario', {
      method: 'POST',
      body: { scenarioId: 'invalid-id' },
    });

    const response = await POST(request);
    const data = await getResponseJSON(response);

    expect(response.status).toBe(404);
    expect(data.error).toBe('シナリオが見つかりません');
  });
});
