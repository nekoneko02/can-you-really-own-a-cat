/**
 * TimeService - 時間管理サービス
 *
 * Application層で時間を管理するサービスです。
 * GameClock と ScaledTime を統合し、UI層に時間情報を提供します。
 */

import { GameClock } from '@/domain/time/GameClock';
import { ScaledTime } from '@/domain/time/ScaledTime';
import { getTimeScale } from '@/domain/time/TimeScales';
import { NightCryActionType } from '@/domain/nightcry/actions/NightCryActionType';

export class TimeService {
  private gameClock: GameClock;
  private actionScaledTime: ScaledTime | null = null;
  private displayTime: number = 2200; // 22:00

  constructor() {
    this.gameClock = new GameClock();
  }

  /**
   * 時間を更新
   * @param deltaMs 経過ミリ秒
   */
  update(deltaMs: number): void {
    this.gameClock.update(deltaMs);
  }

  /**
   * アクション開始時刻を設定
   * @param actionType アクションタイプ
   */
  startActionTime(actionType: NightCryActionType): void {
    const scale = getTimeScale(actionType);
    const currentTime = this.gameClock.getElapsedMs();
    this.actionScaledTime = new ScaledTime(currentTime, scale);
  }

  /**
   * アクション時間計測を停止
   */
  stopActionTime(): void {
    this.actionScaledTime = null;
  }

  /**
   * 経過時間を取得（ミリ秒）
   */
  getElapsedMs(): number {
    return this.gameClock.getElapsedMs();
  }

  /**
   * スケール適用経過時間を取得（ミリ秒）
   */
  getScaledElapsedMs(): number {
    if (!this.actionScaledTime) {
      return 0;
    }
    const currentTime = this.gameClock.getElapsedMs();
    return this.actionScaledTime.getScaledElapsed(currentTime);
  }

  /**
   * 一時停止
   */
  pause(): void {
    this.gameClock.pause();
  }

  /**
   * 再開
   */
  resume(): void {
    this.gameClock.resume();
  }

  /**
   * リセット
   */
  reset(): void {
    this.gameClock.reset();
    this.actionScaledTime = null;
    this.displayTime = 2200;
  }

  /**
   * 表示用時刻を取得
   */
  getDisplayTime(): number {
    return this.displayTime;
  }

  /**
   * 表示用時刻を設定
   */
  setDisplayTime(time: number): void {
    this.displayTime = time;
  }
}
