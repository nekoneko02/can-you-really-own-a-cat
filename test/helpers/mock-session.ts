/**
 * iron-sessionのモック
 */

import { IronSession } from 'iron-session';
import { SessionData } from '@/infrastructure/session';

/**
 * テスト用のセッションモックを作成
 */
export function createMockSession(data: Partial<SessionData> = {}): IronSession<SessionData> {
  const sessionData: SessionData = {
    gameSession: data.gameSession,
    cat: data.cat,
  };

  return {
    ...sessionData,
    save: jest.fn().mockResolvedValue(undefined),
    destroy: jest.fn(),
  } as any;
}

/**
 * iron-sessionのgetIronSessionをモック
 */
export function mockGetIronSession(sessionData: Partial<SessionData> = {}) {
  const session = createMockSession(sessionData);

  jest.mock('iron-session', () => ({
    getIronSession: jest.fn().mockResolvedValue(session),
  }));

  return session;
}
