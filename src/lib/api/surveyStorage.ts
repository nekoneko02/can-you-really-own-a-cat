/**
 * アンケートデータストレージ
 * インターフェース定義とファクトリ関数
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
 * アンケートデータストレージインターフェース
 */
export interface ISurveyStorage {
  /**
   * 開始時アンケートを保存
   */
  saveStartSurvey(
    sessionId: string,
    scenarioSlug: string,
    preSurvey: PreSurvey
  ): Promise<SurveyRecord>;

  /**
   * 完了時アンケートを保存
   * @returns 更新されたレコード、開始記録がない場合はnull
   */
  saveCompleteSurvey(
    sessionId: string,
    postSurvey: PostSurvey
  ): Promise<SurveyRecord | null>;

  /**
   * セッションIDで記録を検索
   */
  findBySessionId(sessionId: string): Promise<SurveyRecord | null>;
}

/**
 * シングルトンインスタンス
 */
let instance: ISurveyStorage | null = null;

/**
 * ストレージインスタンスを取得
 * 常にDynamoDB実装を返す
 */
export async function getSurveyStorage(): Promise<ISurveyStorage> {
  if (!instance) {
    const { DynamoDBSurveyStorage } = await import('../data/DynamoDBSurvey');
    instance = new DynamoDBSurveyStorage();
  }
  return instance;
}

/**
 * ストレージをリセット（テスト用）
 */
export function resetSurveyStorage(): void {
  instance = null;
}

/**
 * テスト用: ストレージインスタンスを設定
 */
export function setSurveyStorage(storage: ISurveyStorage): void {
  instance = storage;
}
