/**
 * 自律的振る舞い管理クラス
 *
 * 猫の自律的な振る舞い全体を管理します。
 * アクション選択・状態遷移を担当します。
 */

import { Cat } from '@/domain/Cat';
import { GamePhase } from '@/domain/types';
import { EventRecord } from '@/domain/EventRecord';
import { AutonomousAction } from './AutonomousAction';
import { AutonomousActionType } from './AutonomousActionType';
import { AutonomousActionConfig } from './AutonomousActionConfig';
import { SleepingAction } from './actions/SleepingAction';
import { SittingAction } from './actions/SittingAction';
import { WanderingAction } from './actions/WanderingAction';
import { MeowingAction } from './actions/MeowingAction';
import { IdlePlayingAction } from './actions/IdlePlayingAction';
import { BeingPettedAction } from './actions/BeingPettedAction';
import { FleeingAction } from './actions/FleeingAction';
import { WaitingAfterCareAction } from './actions/WaitingAfterCareAction';
import { LockedOutAction } from './actions/LockedOutAction';
import { PhaseBasedActionSelector } from './selectors/PhaseBasedActionSelector';
import { TimeBasedActionSelector } from './selectors/TimeBasedActionSelector';
import { HistoryBasedActionModifier } from './selectors/HistoryBasedActionModifier';

export class AutonomousBehaviorManager {
  private actions: Map<AutonomousActionType, AutonomousAction>;
  private phaseSelector: PhaseBasedActionSelector;
  private timeSelector: TimeBasedActionSelector;
  private historyModifier: HistoryBasedActionModifier;

  private lastUpdateTime: number = 0;

  constructor() {
    this.actions = new Map<AutonomousActionType, AutonomousAction>([
      [AutonomousActionType.SLEEPING, new SleepingAction()],
      [AutonomousActionType.SITTING, new SittingAction()],
      [AutonomousActionType.WANDERING, new WanderingAction()],
      [AutonomousActionType.MEOWING, new MeowingAction()],
      [AutonomousActionType.IDLE_PLAYING, new IdlePlayingAction()],
      [AutonomousActionType.BEING_PETTED, new BeingPettedAction()],
      [AutonomousActionType.FLEEING, new FleeingAction()],
      [AutonomousActionType.WAITING_AFTER_CARE, new WaitingAfterCareAction()],
      [AutonomousActionType.LOCKED_OUT, new LockedOutAction()],
    ]);

    this.phaseSelector = new PhaseBasedActionSelector();
    this.timeSelector = new TimeBasedActionSelector();
    this.historyModifier = new HistoryBasedActionModifier();
  }

  /**
   * フェーズに応じたアクションを選択
   * @param phase ゲームフェーズ
   * @returns 選択されたアクションタイプ
   */
  selectActionForPhase(phase: GamePhase): AutonomousActionType {
    return this.phaseSelector.select(phase);
  }

  /**
   * アクションを開始
   * @param cat 猫エンティティ
   * @param actionType アクションタイプ
   * @param gameTime 現在のゲーム時間（ミリ秒）
   */
  startAction(cat: Cat, actionType: AutonomousActionType, gameTime: number): void {
    // 現在のアクションを停止
    this.stopCurrentAction(cat);

    // 新しいアクションを開始
    const action = this.actions.get(actionType);
    if (action) {
      action.start(cat, gameTime);
    }
  }

  /**
   * 現在のアクションを更新
   * @param cat 猫エンティティ
   * @param gameTime 現在のゲーム時間（ミリ秒）
   */
  update(cat: Cat, gameTime: number): void {
    const currentActionType = cat.autonomousBehaviorState.currentAction;
    if (!currentActionType) {
      this.lastUpdateTime = gameTime;
      return;
    }

    const action = this.actions.get(currentActionType);
    if (!action) {
      this.lastUpdateTime = gameTime;
      return;
    }

    // 累積時間を更新
    const deltaTime = this.lastUpdateTime > 0 ? gameTime - this.lastUpdateTime : 0;
    this.updateCumulativeTime(cat, currentActionType, deltaTime);
    this.lastUpdateTime = gameTime;

    // アクションを更新
    action.update(cat, gameTime);

    // アクションが完了した場合、次のアクションへ遷移
    if (action.isCompleted(cat, gameTime)) {
      const elapsedTime = gameTime - cat.autonomousBehaviorState.actionStartTime;
      const nextActionType = this.timeSelector.select(currentActionType, elapsedTime);

      if (nextActionType) {
        action.stop(cat);
        this.startAction(cat, nextActionType, gameTime);
      }
    }
  }

  /**
   * 累積時間を更新
   */
  private updateCumulativeTime(
    cat: Cat,
    actionType: AutonomousActionType,
    deltaTime: number
  ): void {
    if (deltaTime <= 0) return;

    const state = cat.autonomousBehaviorState;
    const updates: Partial<typeof state> = {};

    switch (actionType) {
      case AutonomousActionType.MEOWING:
        updates.cumulativeMeowingTime = state.cumulativeMeowingTime + deltaTime;
        break;
      case AutonomousActionType.LOCKED_OUT:
        updates.cumulativeLockedOutTime = state.cumulativeLockedOutTime + deltaTime;
        break;
      case AutonomousActionType.IDLE_PLAYING:
        updates.cumulativePlayingTime = state.cumulativePlayingTime + deltaTime;
        break;
      case AutonomousActionType.BEING_PETTED:
        updates.cumulativePettingTime = state.cumulativePettingTime + deltaTime;
        break;
    }

    if (Object.keys(updates).length > 0) {
      cat.updateAutonomousBehaviorState(updates);
    }
  }

  /**
   * 現在のアクションを停止
   * @param cat 猫エンティティ
   */
  stopCurrentAction(cat: Cat): void {
    const currentActionType = cat.autonomousBehaviorState.currentAction;
    if (!currentActionType) {
      return;
    }

    const action = this.actions.get(currentActionType);
    if (action) {
      action.stop(cat);
    }
  }

  /**
   * 履歴に基づいて状態を修正
   * @param cat 猫エンティティ
   * @param history イベント履歴
   */
  applyHistoryModification(cat: Cat, history: EventRecord[]): void {
    const result = this.historyModifier.modify(cat.autonomousBehaviorState, history);

    // 状態を更新
    if (Object.keys(result.state).length > 0) {
      cat.updateAutonomousBehaviorState(result.state);
    }

    // 初期気分を設定
    if (result.initialMood) {
      cat.setMood(result.initialMood);
    }
  }

  /**
   * 現在のアクションタイプを取得
   * @param cat 猫エンティティ
   * @returns 現在のアクションタイプ
   */
  getCurrentActionType(cat: Cat): AutonomousActionType | null {
    return cat.autonomousBehaviorState.currentAction;
  }

  /**
   * アクションが完了しているか判定
   * @param cat 猫エンティティ
   * @param gameTime 現在のゲーム時間（ミリ秒）
   * @returns 完了している場合 true
   */
  isCurrentActionCompleted(cat: Cat, gameTime: number): boolean {
    const currentActionType = cat.autonomousBehaviorState.currentAction;
    if (!currentActionType) {
      return true;
    }

    const action = this.actions.get(currentActionType);
    if (!action) {
      return true;
    }

    return action.isCompleted(cat, gameTime);
  }

  /**
   * 朝シーンへの遷移条件を判定
   * @param cat 猫エンティティ
   * @returns 遷移可能な場合 true
   */
  checkMorningTransition(cat: Cat): boolean {
    const state = cat.autonomousBehaviorState;

    // 条件1: MEOWING + LOCKED_OUT の累積時間が閾値以上
    const meowingOrLockedOut =
      state.cumulativeMeowingTime + state.cumulativeLockedOutTime;
    if (
      meowingOrLockedOut >=
      AutonomousActionConfig.morningTransition.meowingOrLockedOutThreshold
    ) {
      return true;
    }

    // 条件2: PLAYING + PETTING の累積時間が閾値以上
    const playingOrPetting =
      state.cumulativePlayingTime + state.cumulativePettingTime;
    if (
      playingOrPetting >=
      AutonomousActionConfig.morningTransition.feedingOrPlayingThreshold
    ) {
      return true;
    }

    return false;
  }

  /**
   * FleeingActionにプレイヤー位置を設定
   */
  setPlayerPositionForFleeing(x: number, y: number): void {
    const fleeingAction = this.actions.get(
      AutonomousActionType.FLEEING
    ) as FleeingAction;
    if (fleeingAction) {
      fleeingAction.setPlayerPosition(x, y);
    }
  }
}
