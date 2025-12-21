/**
 * NightCryEvent - 夜泣きイベント集約
 *
 * 夜泣きイベントの状態を一元管理する集約ルートです。
 * 満足度・諦め度の管理、アクション状態の管理を担当します。
 *
 * Cat.nightCryState から分離し、イベント固有の状態として管理します。
 */

import { NightCryActionType } from '@/domain/nightcry/actions/NightCryActionType';

/** アクション完了に必要な時間（ゲーム内ミリ秒） */
const ACTION_DURATION = 15 * 60 * 1000; // 15分

/** 満足度を上げるアクション */
const SATISFACTION_ACTIONS: NightCryActionType[] = [
  NightCryActionType.PLAYING,
  NightCryActionType.PETTING,
  NightCryActionType.FEEDING_SNACK,
];

/** 諦め度を上げるアクション */
const RESIGNATION_ACTIONS: NightCryActionType[] = [
  NightCryActionType.IGNORING,
  NightCryActionType.LOCKED_OUT,
];

/**
 * 夜泣きイベントの結果
 */
export interface NightCryEventResult {
  /** 満足度（0.0 - 1.0） */
  satisfaction: number;
  /** 諦め度（0.0 - 1.0） */
  resignation: number;
  /** 完了した場合、どちらで完了したか */
  completedBy: 'satisfaction' | 'resignation' | null;
}

/**
 * 夜泣きイベント集約
 */
export class NightCryEvent {
  private active: boolean = false;
  private satisfaction: number = 0;
  private resignation: number = 0;
  private currentAction: NightCryActionType | null = null;
  private actionStartTime: number = 0;

  /**
   * イベントを開始
   */
  start(): void {
    this.active = true;
  }

  /**
   * アクションを開始
   * @param actionType アクションタイプ
   * @throws イベントが開始していない場合
   */
  startAction(actionType: NightCryActionType): void {
    if (!this.active) {
      throw new Error('Event is not started');
    }
    this.currentAction = actionType;
    this.actionStartTime = 0;
  }

  /**
   * イベントを更新
   * @param scaledElapsedTime スケール適用済みの経過時間（ミリ秒）
   */
  update(scaledElapsedTime: number): void {
    if (!this.active || !this.currentAction) {
      return;
    }

    const progress = Math.min(1.0, scaledElapsedTime / ACTION_DURATION);

    if (SATISFACTION_ACTIONS.includes(this.currentAction)) {
      this.satisfaction = progress;
    } else if (RESIGNATION_ACTIONS.includes(this.currentAction)) {
      this.resignation = progress;
    }
  }

  /**
   * アクションを停止
   */
  stopAction(): void {
    this.currentAction = null;
  }

  /**
   * イベントがアクティブか
   */
  isActive(): boolean {
    return this.active;
  }

  /**
   * イベントが完了したか
   */
  isCompleted(): boolean {
    return this.satisfaction >= 1.0 || this.resignation >= 1.0;
  }

  /**
   * 満足度を取得
   */
  getSatisfaction(): number {
    return this.satisfaction;
  }

  /**
   * 諦め度を取得
   */
  getResignation(): number {
    return this.resignation;
  }

  /**
   * 現在のアクションを取得
   */
  getCurrentAction(): NightCryActionType | null {
    return this.currentAction;
  }

  /**
   * アクション開始時刻を取得
   */
  getActionStartTime(): number {
    return this.actionStartTime;
  }

  /**
   * イベント結果を取得
   */
  getResult(): NightCryEventResult {
    let completedBy: 'satisfaction' | 'resignation' | null = null;

    if (this.satisfaction >= 1.0) {
      completedBy = 'satisfaction';
    } else if (this.resignation >= 1.0) {
      completedBy = 'resignation';
    }

    return {
      satisfaction: this.satisfaction,
      resignation: this.resignation,
      completedBy,
    };
  }

  /**
   * イベントをリセット
   */
  reset(): void {
    this.active = false;
    this.satisfaction = 0;
    this.resignation = 0;
    this.currentAction = null;
    this.actionStartTime = 0;
  }
}
