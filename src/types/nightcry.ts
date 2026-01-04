/**
 * 夜泣きシナリオ関連の型定義
 */

import type { NightcryScenarioState } from '@/domain/scenarios/nightcry';

/**
 * iron-session で管理するセッションデータ
 */
export interface NightcrySession {
  /** セッションID (UUIDv4) */
  sessionId: string;
  /** シナリオ識別子 */
  scenarioSlug: string;
  /** シナリオ開始日時 (ISO8601) */
  startedAt?: string;
  /** シナリオ完了日時 (ISO8601) */
  completedAt?: string;
}

/**
 * iron-session のセッション型拡張
 */
declare module 'iron-session' {
  interface IronSessionData {
    nightcry?: NightcrySession;
  }
}

/**
 * localStorage に保存するデータ
 */
export interface NightcryLocalData {
  /** シナリオ進行状態 */
  scenarioState: NightcryScenarioState;
}
