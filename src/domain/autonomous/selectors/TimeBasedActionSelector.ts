/**
 * 時間経過に基づくアクション選択
 *
 * 現在のアクションが完了した後、次のアクションを選択します。
 */

import { AutonomousActionType } from '../AutonomousActionType';
import { AutonomousActionConfig } from '../AutonomousActionConfig';

interface TransitionRule {
  threshold: number;
  next: AutonomousActionType[];
}

/**
 * アクション遷移ルール
 * - threshold: 経過時間（ミリ秒）
 * - next: 遷移先候補（ランダムに選択）
 */
const TRANSITION_RULES: Record<AutonomousActionType, TransitionRule> = {
  [AutonomousActionType.MEOWING]: {
    threshold: AutonomousActionConfig.meowing.baseDuration,
    next: [AutonomousActionType.SITTING],
  },
  [AutonomousActionType.SITTING]: {
    threshold: AutonomousActionConfig.sitting.duration,
    next: [AutonomousActionType.WANDERING],
  },
  [AutonomousActionType.WANDERING]: {
    threshold: AutonomousActionConfig.wandering.duration,
    next: [AutonomousActionType.SITTING],
  },
  [AutonomousActionType.IDLE_PLAYING]: {
    threshold: Infinity, // ユーザー操作まで継続
    next: [],
  },
  [AutonomousActionType.SLEEPING]: {
    threshold: Infinity, // 眠るは自然には終了しない
    next: [],
  },
  [AutonomousActionType.BEING_PETTED]: {
    threshold: Infinity, // ユーザー操作まで継続
    next: [],
  },
  [AutonomousActionType.FLEEING]: {
    threshold: 0, // isCompletedで判断するため0（距離ベース）
    next: [AutonomousActionType.SITTING], // 捕まったらSITTINGへ
  },
  [AutonomousActionType.WAITING_AFTER_CARE]: {
    threshold: AutonomousActionConfig.waitingAfterCare.duration,
    next: [AutonomousActionType.MEOWING],
  },
  [AutonomousActionType.LOCKED_OUT]: {
    threshold: Infinity, // ユーザー操作まで継続
    next: [],
  },
};

export class TimeBasedActionSelector {
  /**
   * 時間経過に基づいて次のアクションを選択
   * @param currentAction 現在のアクション
   * @param elapsedTime 経過時間（ミリ秒）
   * @returns 次のアクション、または遷移不要の場合は null
   */
  select(
    currentAction: AutonomousActionType,
    elapsedTime: number
  ): AutonomousActionType | null {
    const rule = TRANSITION_RULES[currentAction];

    if (!rule || elapsedTime < rule.threshold) {
      return null;
    }

    if (rule.next.length === 0) {
      return null;
    }

    // 次のアクションをランダムに選択
    const index = Math.floor(Math.random() * rule.next.length);
    return rule.next[index];
  }

  /**
   * アクションの基本持続時間を取得
   * @param actionType アクションタイプ
   * @returns 持続時間（ミリ秒）
   */
  getDuration(actionType: AutonomousActionType): number {
    return TRANSITION_RULES[actionType]?.threshold ?? Infinity;
  }
}
