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
  private baseDisplayTime: number = 2200; // 22:00（アクション開始時の時刻）
  private accumulatedGameTimeMs: number = 0; // 累積ゲーム時間（ミリ秒）

  constructor() {
    this.gameClock = new GameClock();
  }

  /**
   * 時間を更新
   * @param deltaMs 経過ミリ秒
   */
  update(deltaMs: number): void {
    this.gameClock.update(deltaMs);

    // アクション中はスケール適用した時間を累積
    if (this.actionScaledTime) {
      const currentTime = this.gameClock.getElapsedMs();
      const scaledElapsed = this.actionScaledTime.getScaledElapsed(currentTime);
      this.accumulatedGameTimeMs = scaledElapsed;
    }
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
   * 累積時間をbaseDisplayTimeに反映
   */
  stopActionTime(): void {
    if (this.actionScaledTime) {
      // 累積時間をbaseDisplayTimeに反映
      const elapsedMinutes = Math.floor(this.accumulatedGameTimeMs / 60000);
      this.baseDisplayTime = this.addMinutesToTime(this.baseDisplayTime, elapsedMinutes);
      this.accumulatedGameTimeMs = 0;
    }
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
    this.baseDisplayTime = 2200;
    this.accumulatedGameTimeMs = 0;
  }

  /**
   * 表示用時刻を取得
   * アクション中は累積ゲーム時間を加算した時刻を返す
   */
  getDisplayTime(): number {
    if (this.actionScaledTime) {
      const elapsedMinutes = Math.floor(this.accumulatedGameTimeMs / 60000);
      return this.addMinutesToTime(this.baseDisplayTime, elapsedMinutes);
    }
    return this.baseDisplayTime;
  }

  /**
   * 表示用時刻を設定
   */
  setDisplayTime(time: number): void {
    this.baseDisplayTime = time;
    this.accumulatedGameTimeMs = 0;
  }

  /**
   * 時刻に分を加算（HHMM形式）
   * @param time 時刻（HHMM形式）
   * @param minutes 加算する分
   * @returns 加算後の時刻（HHMM形式）
   */
  private addMinutesToTime(time: number, minutes: number): number {
    const hours = Math.floor(time / 100);
    const mins = time % 100;

    let totalMinutes = hours * 60 + mins + minutes;

    // 24時間を超えた場合は次の日に
    totalMinutes = totalMinutes % (24 * 60);

    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;

    return newHours * 100 + newMins;
  }
}
