/**
 * ゲーム結果
 *
 * 1週間のゲームプレイ終了時にReact層に返すデータ。
 * Domainチームが生成し、Reactチームが使用します。
 */

import { PlayerStats } from './PlayerStats';
import { CatStatus } from './CatStatus';
import { EventRecord, EmotionData } from './EventRecord';

/**
 * レポート（振り返り）
 */
export interface Report {
  playerBehaviorPattern: string; // プレイヤーの行動パターン分析結果
  feedbackText: string;          // フィードバックテキスト
  emotionLog: EmotionData[];     // 感情ログ
}

/**
 * ゲーム結果
 */
export interface GameResult {
  scenarioId: string;
  completed: boolean;
  playerStats: PlayerStats;
  finalCatStatus: CatStatus;
  eventHistory: EventRecord[];
  report: Report;
}
