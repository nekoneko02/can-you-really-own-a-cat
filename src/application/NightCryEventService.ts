/**
 * NightCryEventService - 夜泣きイベント制御サービス
 *
 * Application層で夜泣きイベントを制御するサービスです。
 * NightCryEvent（Domain層）と TimeService を連携させます。
 */

import { NightCryEvent, NightCryEventResult } from '@/domain/events/nightcry/NightCryEvent';
import { NightCryActionType } from '@/domain/nightcry/actions/NightCryActionType';
import { TimeService } from './TimeService';

/**
 * 夜泣きイベントの状態
 */
export interface NightCryEventState {
  isActive: boolean;
  isCompleted: boolean;
  currentAction: NightCryActionType | null;
  satisfaction: number;
  resignation: number;
}

export class NightCryEventService {
  private event: NightCryEvent;
  private timeService: TimeService;

  constructor(timeService: TimeService) {
    this.event = new NightCryEvent();
    this.timeService = timeService;
  }

  /**
   * イベントを開始
   */
  start(): void {
    this.event.start();
  }

  /**
   * アクションを選択
   * @param actionType アクションタイプ
   */
  selectAction(actionType: NightCryActionType): void {
    this.event.startAction(actionType);
    this.timeService.startActionTime(actionType);
  }

  /**
   * イベントを更新
   */
  update(): void {
    if (!this.event.isActive()) {
      return;
    }

    const scaledElapsed = this.timeService.getScaledElapsedMs();
    this.event.update(scaledElapsed);
  }

  /**
   * イベントを停止
   * @returns イベント結果
   */
  stop(): NightCryEventResult {
    const result = this.event.getResult();
    this.event.reset();
    this.timeService.stopActionTime();
    return result;
  }

  /**
   * イベントがアクティブか
   */
  isActive(): boolean {
    return this.event.isActive();
  }

  /**
   * イベントが完了したか
   */
  isCompleted(): boolean {
    return this.event.isCompleted();
  }

  /**
   * 現在のアクションを取得
   */
  getCurrentAction(): NightCryActionType | null {
    return this.event.getCurrentAction();
  }

  /**
   * 満足度を取得
   */
  getSatisfaction(): number {
    return this.event.getSatisfaction();
  }

  /**
   * 諦め度を取得
   */
  getResignation(): number {
    return this.event.getResignation();
  }

  /**
   * 現在の状態を取得
   */
  getState(): NightCryEventState {
    return {
      isActive: this.event.isActive(),
      isCompleted: this.event.isCompleted(),
      currentAction: this.event.getCurrentAction(),
      satisfaction: this.event.getSatisfaction(),
      resignation: this.event.getResignation(),
    };
  }

  /**
   * イベント結果を取得
   */
  getResult(): NightCryEventResult {
    return this.event.getResult();
  }
}
