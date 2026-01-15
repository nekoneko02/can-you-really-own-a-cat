/**
 * テスト用インメモリアンケートストレージ
 */

import type { ISurveyStorage, SurveyRecord } from '@/lib/api/surveyStorage';
import type { PreSurvey, PostSurvey } from '@/lib/api/types';

/**
 * インメモリ実装のアンケートデータストレージ（テスト専用）
 */
export class InMemorySurveyStorage implements ISurveyStorage {
  private records: Map<string, SurveyRecord> = new Map();

  /**
   * 開始時アンケートを保存
   */
  async saveStartSurvey(
    sessionId: string,
    scenarioSlug: string,
    preSurvey: PreSurvey
  ): Promise<SurveyRecord> {
    const now = new Date().toISOString();
    const record: SurveyRecord = {
      sessionId,
      scenarioSlug,
      preSurvey,
      startedAt: now,
    };

    this.records.set(sessionId, record);
    return record;
  }

  /**
   * 完了時アンケートを保存
   * @returns 更新されたレコード、開始記録がない場合はnull
   */
  async saveCompleteSurvey(
    sessionId: string,
    postSurvey: PostSurvey
  ): Promise<SurveyRecord | null> {
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
    return updated;
  }

  /**
   * セッションIDで記録を検索
   */
  async findBySessionId(sessionId: string): Promise<SurveyRecord | null> {
    return this.records.get(sessionId) || null;
  }

  /**
   * 全レコードをクリア（テスト用）
   */
  clear(): void {
    this.records.clear();
  }

  /**
   * レコード数を取得（テスト用）
   */
  size(): number {
    return this.records.size;
  }
}
