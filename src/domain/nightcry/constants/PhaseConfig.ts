/**
 * 夜泣きシナリオのフェーズ設定
 *
 * 各フェーズの開始時刻と時間スケールを定義します。
 */

import { GamePhase } from '@/domain/types';

/**
 * フェーズ設定の型
 */
export interface PhaseConfig {
  /** 開始時刻（HHMM形式、例: 2200 = 22:00） */
  startTime: number;
  /** 時間スケール（1.0 = 等倍、30.0 = 30倍速） */
  timeScale: number;
}

/**
 * 夜泣きシナリオのフェーズ別設定
 *
 * - NIGHT_PREP: 就寝準備（22:00開始、等倍速）
 * - MIDNIGHT_EVENT: 夜泣きイベント（3:00開始、30倍速）
 * - MORNING_OUTRO: 朝の振り返り（7:00開始、等倍速）
 * - GAME_END: ゲーム終了（時間停止）
 */
export const NightCryPhaseConfig: Record<GamePhase, PhaseConfig> = {
  [GamePhase.NIGHT_PREP]: {
    startTime: 2200,
    timeScale: 1.0,
  },
  [GamePhase.MIDNIGHT_EVENT]: {
    startTime: 300,
    timeScale: 30.0,
  },
  [GamePhase.MORNING_OUTRO]: {
    startTime: 700,
    timeScale: 1.0,
  },
  [GamePhase.GAME_END]: {
    startTime: 700,
    timeScale: 0,
  },
} as const;

/**
 * フェーズ設定を取得
 * @param phase ゲームフェーズ
 * @returns フェーズ設定
 */
export function getPhaseConfig(phase: GamePhase): PhaseConfig {
  return NightCryPhaseConfig[phase];
}
