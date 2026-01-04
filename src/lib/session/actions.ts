'use server';

/**
 * セッション操作の Server Actions
 */

import { cookies } from 'next/headers';
import { getIronSession, IronSession } from 'iron-session';
import { sessionOptions } from './config';
import { generateSessionId } from './utils';
import type { NightcrySession } from '@/types/nightcry';

/**
 * iron-session のセッション型
 */
interface SessionData {
  nightcry?: NightcrySession;
}

/**
 * セッションを取得する（内部用）
 */
async function getIronSessionData(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

/**
 * 新しいセッションを作成する
 */
export async function createSession(
  scenarioSlug: string
): Promise<NightcrySession> {
  const session = await getIronSessionData();
  const newSession: NightcrySession = {
    sessionId: generateSessionId(),
    scenarioSlug,
  };

  session.nightcry = newSession;
  await session.save();

  return newSession;
}

/**
 * 現在のセッションを取得する
 */
export async function getSession(): Promise<NightcrySession | null> {
  const session = await getIronSessionData();
  return session.nightcry || null;
}

/**
 * セッションを更新する
 */
export async function updateSession(
  updates: Partial<Pick<NightcrySession, 'startedAt' | 'completedAt'>>
): Promise<NightcrySession | null> {
  const session = await getIronSessionData();

  if (!session.nightcry) {
    return null;
  }

  session.nightcry = {
    ...session.nightcry,
    ...updates,
  };

  await session.save();
  return session.nightcry;
}

/**
 * セッションをクリアする
 */
export async function clearSession(): Promise<void> {
  const session = await getIronSessionData();
  session.nightcry = undefined;
  await session.save();
}
