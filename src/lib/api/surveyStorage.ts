/**
 * アンケートデータストレージ
 * MVP段階ではログ出力（後でDB移行可能な設計）
 */

import type { PreSurvey, PostSurvey } from './types';

/**
 * アンケート記録
 */
export interface SurveyRecord {
  sessionId: string;
  scenarioSlug: string;
  preSurvey: PreSurvey;
  postSurvey?: PostSurvey;
  startedAt: string;
  completedAt?: string;
}

/**
 * アンケートデータストレージ
 * インメモリ保存 + ログ出力
 */
export class SurveyStorage {
  private records: Map<string, SurveyRecord> = new Map();

  /**
   * 開始時アンケートを保存
   */
  saveStartSurvey(
    sessionId: string,
    scenarioSlug: string,
    preSurvey: PreSurvey
  ): SurveyRecord {
    const now = new Date().toISOString();
    const record: SurveyRecord = {
      sessionId,
      scenarioSlug,
      preSurvey,
      startedAt: now,
    };

    this.records.set(sessionId, record);
    this.logRecord('START', record);

    return record;
  }

  /**
   * 完了時アンケートを保存
   * @returns 更新されたレコード、開始記録がない場合はnull
   */
  saveCompleteSurvey(
    sessionId: string,
    postSurvey: PostSurvey
  ): SurveyRecord | null {
    const existing = this.records.get(sessionId);
    if (!existing) {
      return null;
    }

    const now = new Date().toISOString();
    const updated: SurveyRecord = {
      ...existing,
      postSurvey,
      completedAt: now,
    };

    this.records.set(sessionId, updated);
    this.logRecord('COMPLETE', updated);

    return updated;
  }

  /**
   * セッションIDで記録を検索
   */
  findBySessionId(sessionId: string): SurveyRecord | null {
    return this.records.get(sessionId) || null;
  }

  /**
   * ログ出力
   */
  private logRecord(type: 'START' | 'COMPLETE', record: SurveyRecord): void {
    const logEntry = {
      type: `SURVEY_${type}`,
      timestamp: new Date().toISOString(),
      ...record,
    };

    // JSON形式でログ出力（後で分析可能な形式）
    console.info(JSON.stringify(logEntry));
  }
}

/**
 * シングルトンインスタンス
 */
let instance: SurveyStorage | null = null;

/**
 * ストレージインスタンスを取得
 */
export function getSurveyStorage(): SurveyStorage {
  if (!instance) {
    instance = new SurveyStorage();
  }
  return instance;
}

/**
 * ストレージをリセット（テスト用）
 */
export function resetSurveyStorage(): void {
  instance = null;
}
