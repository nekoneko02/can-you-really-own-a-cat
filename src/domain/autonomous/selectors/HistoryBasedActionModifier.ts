/**
 * 履歴に基づくアクション修正
 *
 * 過去の選択履歴に基づいて、猫の自律的振る舞いの状態を修正します。
 */

import { EventRecord } from '@/domain/EventRecord';
import {
  AutonomousBehaviorState,
  DEFAULT_MEOWING_DURATION,
} from '../AutonomousBehaviorState';
import { CatMood } from '@/domain/types';

/** 無視された場合の鳴く時間の増加量（10秒） */
const IGNORED_MEOWING_INCREASE = 10000;

/** 3日連続無視時の鳴く時間の増加量（20秒） */
const CONSECUTIVE_IGNORED_MEOWING_INCREASE = 20000;

export interface HistoryModificationResult {
  state: Partial<AutonomousBehaviorState>;
  initialMood: CatMood | null;
}

export class HistoryBasedActionModifier {
  /**
   * 履歴に基づいて状態を修正
   * @param currentState 現在の状態
   * @param history イベント履歴
   * @returns 修正後の状態と初期気分
   */
  modify(
    currentState: AutonomousBehaviorState,
    history: EventRecord[]
  ): HistoryModificationResult {
    if (history.length === 0) {
      return { state: {}, initialMood: null };
    }

    let meowingDuration = DEFAULT_MEOWING_DURATION;
    let initialMood: CatMood | null = null;

    // 前日の選択を確認
    const lastEvent = history[history.length - 1];
    switch (lastEvent.choiceId) {
      case 'wait':
      case 'ignore':
        // 無視された場合、鳴く時間が長くなる
        meowingDuration += IGNORED_MEOWING_INCREASE;
        break;
      case 'catch':
        // 捕まえられた場合、警戒心が高くなる
        initialMood = CatMood.SCARED;
        break;
      case 'play':
        // 遊んでもらった場合、機嫌が良い
        initialMood = CatMood.HAPPY;
        break;
    }

    // 3日連続のパターンを確認
    const recentChoices = history.slice(-3).map((e) => e.choiceId);
    if (
      recentChoices.length >= 3 &&
      recentChoices.every((choice) => choice === 'wait' || choice === 'ignore')
    ) {
      // 3日連続無視された場合、さらに鳴く時間が長くなる
      meowingDuration += CONSECUTIVE_IGNORED_MEOWING_INCREASE;
    }

    return {
      state: { meowingDuration },
      initialMood,
    };
  }
}
