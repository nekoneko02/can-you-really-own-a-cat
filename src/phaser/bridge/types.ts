/**
 * ReactBridge - 型定義
 *
 * PhaserからReactへ渡すデータ型を定義します。
 */

import type { CatStatus } from '@/domain/CatStatus';
import type { PlayerStats } from '@/domain/PlayerStats';

/**
 * ゲーム結果（Reactへ渡すデータ）
 */
export interface GameResult {
  /** シナリオID */
  scenarioId: string;

  /** ゲームを完走したか */
  completed: boolean;

  /** プレイヤー統計 */
  playerStats: {
    /** 総睡眠時間（時間） */
    totalSleepTime: number;
    /** 起こされた回数 */
    interruptedCount: number;
    /** 遊んだ回数 */
    playedCount: number;
    /** 撫でた回数 */
    pettedCount: number;
  };

  /** 猫の最終状態 */
  finalCatStatus: {
    /** なつき度（0-100） */
    affection: number;
    /** ストレス（0-100） */
    stress: number;
    /** 健康度（0-100） */
    health: number;
    /** 空腹度（0-100） */
    hunger: number;
  };

  /** イベント履歴 */
  eventHistory: EventHistoryItem[];

  /** レポート（終了時画面で表示） */
  report: {
    /** 総括 */
    summary: string;
    /** 得意だったこと */
    strengths: string[];
    /** 苦手だったこと */
    weaknesses: string[];
  };
}

/**
 * イベント履歴アイテム
 */
export interface EventHistoryItem {
  /** イベントID */
  eventId: string;
  /** 発生日 */
  day: number;
  /** 発生時刻 */
  time: number;
  /** 選択した選択肢ID */
  choiceId: string;
  /** 結果テキスト */
  resultText: string;
}

/**
 * window.onGameComplete の型定義
 */
declare global {
  interface Window {
    onGameComplete?: (result: GameResult) => void;
  }
}
