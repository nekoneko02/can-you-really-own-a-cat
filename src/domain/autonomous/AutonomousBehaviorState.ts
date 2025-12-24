/**
 * 自律的振る舞いの状態
 *
 * 猫の自律的な振る舞いに関する状態を管理します。
 */

import { AutonomousActionType } from './AutonomousActionType';

export interface AutonomousBehaviorState {
  /** 現在のアクション */
  currentAction: AutonomousActionType | null;
  /** アクション開始時のゲーム時間（ミリ秒） */
  actionStartTime: number;
  /** 鳴く時間（ミリ秒）- 履歴により変動 */
  meowingDuration: number;
  /** 最後に鳴いた時のゲーム時間（ミリ秒） */
  lastMeowTime: number;
  /** 鳴いた回数（アクション開始からのカウント） */
  meowCount: number;
  /** 猫が表示されているか */
  isVisible: boolean;
  /** MEOWINGの累積時間（ミリ秒） */
  cumulativeMeowingTime: number;
  /** LOCKED_OUTの累積時間（ミリ秒） */
  cumulativeLockedOutTime: number;
  /** IDLE_PLAYINGの累積時間（ミリ秒） */
  cumulativePlayingTime: number;
  /** BEING_PETTEDの累積時間（ミリ秒） */
  cumulativePettingTime: number;
}

/** デフォルトの鳴く時間（30秒） */
export const DEFAULT_MEOWING_DURATION = 30000;

/**
 * 初期状態を作成
 */
export function createInitialAutonomousBehaviorState(): AutonomousBehaviorState {
  return {
    currentAction: null,
    actionStartTime: 0,
    meowingDuration: DEFAULT_MEOWING_DURATION,
    lastMeowTime: 0,
    meowCount: 0,
    isVisible: true,
    cumulativeMeowingTime: 0,
    cumulativeLockedOutTime: 0,
    cumulativePlayingTime: 0,
    cumulativePettingTime: 0,
  };
}
