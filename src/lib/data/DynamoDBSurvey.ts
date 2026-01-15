/**
 * DynamoDB アンケートデータストレージ実装
 */

import type { ISurveyStorage, SurveyRecord } from '../api/surveyStorage';
import type { PreSurvey, PostSurvey } from '../api/types';
import { getDataClient } from './amplifyDataClient';

/**
 * DynamoDB実装のアンケートデータストレージ
 */
export class DynamoDBSurveyStorage implements ISurveyStorage {
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

    try {
      const client = getDataClient();
      await client.models.Survey.create({
        sessionId,
        scenarioSlug,
        preSurvey: JSON.stringify(preSurvey),
        startedAt: now,
      });

      this.logRecord('START', record);
    } catch (error) {
      console.error('Failed to save start survey to DynamoDB:', error);
      // エラー時もレコードを返す（ユーザー体験に影響させない）
    }

    return record;
  }

  /**
   * シナリオ完了を記録
   * @returns 更新されたレコード、開始記録がない場合はnull
   */
  async saveScenarioComplete(sessionId: string): Promise<SurveyRecord | null> {
    const now = new Date().toISOString();

    try {
      const client = getDataClient();

      // 既存レコードを取得
      const { data: existing } = await client.models.Survey.get({ sessionId });

      if (!existing) {
        console.warn(`Start record not found for session: ${sessionId}`);
        return null;
      }

      // レコードを更新
      const { data: updated } = await client.models.Survey.update({
        sessionId,
        scenarioCompletedAt: now,
      });

      if (!updated) {
        console.error(`Failed to update survey for session: ${sessionId}`);
        return null;
      }

      const record: SurveyRecord = {
        sessionId: updated.sessionId,
        scenarioSlug: updated.scenarioSlug,
        preSurvey: JSON.parse(updated.preSurvey as string) as PreSurvey,
        postSurvey: updated.postSurvey
          ? (JSON.parse(updated.postSurvey as string) as PostSurvey)
          : undefined,
        startedAt: updated.startedAt,
        scenarioCompletedAt: now,
        completedAt: updated.completedAt ?? undefined,
      };

      this.logRecord('SCENARIO_COMPLETE', record);
      return record;
    } catch (error) {
      console.error('Failed to save scenario complete to DynamoDB:', error);
      return null;
    }
  }

  /**
   * 完了時アンケートを保存
   * @returns 更新されたレコード、開始記録がない場合はnull
   */
  async saveCompleteSurvey(
    sessionId: string,
    postSurvey: PostSurvey
  ): Promise<SurveyRecord | null> {
    const now = new Date().toISOString();

    try {
      const client = getDataClient();

      // 既存レコードを取得
      const { data: existing } = await client.models.Survey.get({ sessionId });

      if (!existing) {
        console.warn(`Start record not found for session: ${sessionId}`);
        return null;
      }

      // レコードを更新
      const { data: updated } = await client.models.Survey.update({
        sessionId,
        postSurvey: JSON.stringify(postSurvey),
        completedAt: now,
      });

      if (!updated) {
        console.error(`Failed to update survey for session: ${sessionId}`);
        return null;
      }

      const record: SurveyRecord = {
        sessionId: updated.sessionId,
        scenarioSlug: updated.scenarioSlug,
        preSurvey: JSON.parse(updated.preSurvey as string) as PreSurvey,
        postSurvey,
        startedAt: updated.startedAt,
        scenarioCompletedAt: updated.scenarioCompletedAt ?? undefined,
        completedAt: now,
      };

      this.logRecord('COMPLETE', record);
      return record;
    } catch (error) {
      console.error('Failed to save complete survey to DynamoDB:', error);
      return null;
    }
  }

  /**
   * セッションIDで記録を検索
   */
  async findBySessionId(sessionId: string): Promise<SurveyRecord | null> {
    try {
      const client = getDataClient();
      const { data } = await client.models.Survey.get({ sessionId });

      if (!data) {
        return null;
      }

      const record: SurveyRecord = {
        sessionId: data.sessionId,
        scenarioSlug: data.scenarioSlug,
        preSurvey: JSON.parse(data.preSurvey as string) as PreSurvey,
        postSurvey: data.postSurvey ? JSON.parse(data.postSurvey as string) as PostSurvey : undefined,
        startedAt: data.startedAt,
        scenarioCompletedAt: data.scenarioCompletedAt ?? undefined,
        completedAt: data.completedAt ?? undefined,
      };

      return record;
    } catch (error) {
      console.error('Failed to find survey in DynamoDB:', error);
      return null;
    }
  }

  /**
   * ログ出力
   */
  private logRecord(type: 'START' | 'SCENARIO_COMPLETE' | 'COMPLETE', record: SurveyRecord): void {
    const logEntry = {
      type: `SURVEY_${type}`,
      timestamp: new Date().toISOString(),
      ...record,
    };

    // JSON形式でログ出力（後で分析可能な形式）
    console.info(JSON.stringify(logEntry));
  }
}
