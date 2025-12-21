/**
 * 締め出しアクション
 *
 * プレイヤーが猫を別の部屋に締め出すアクションを表現します。
 * 15分経過で諦め度がMaxになります。
 */

import { Cat } from '@/domain/Cat';
import { NightCryActionType } from './NightCryActionType';
import { NightCryTimeConstants } from '../constants/TimeConstants';
import { ResignationCalculator } from '../calculators/ResignationCalculator';

export class LockedOutAction {
  private resignationCalculator: ResignationCalculator;

  constructor() {
    this.resignationCalculator = new ResignationCalculator();
  }

  /**
   * アクションを開始
   * @param cat 猫エンティティ
   * @param gameTime 現在のゲーム時間（ミリ秒）
   */
  start(cat: Cat, gameTime: number): void {
    cat.updateNightCryState({
      currentAction: NightCryActionType.LOCKED_OUT,
      actionStartTime: gameTime,
    });
  }

  /**
   * アクションを更新
   * @param cat 猫エンティティ
   * @param gameTime 現在のゲーム時間（ミリ秒）
   */
  update(cat: Cat, gameTime: number): void {
    const elapsedTime = gameTime - cat.nightCryState.actionStartTime;
    const maxTime = NightCryTimeConstants.LOCKED_OUT_DURATION;

    const resignation = this.resignationCalculator.calculate(elapsedTime, maxTime);

    cat.updateNightCryState({
      resignation,
    });
  }

  /**
   * アクションが完了したか判定
   * @param cat 猫エンティティ
   * @returns 完了している場合 true
   */
  isCompleted(cat: Cat): boolean {
    return cat.nightCryState.resignation >= 1.0;
  }

  /**
   * アクションを停止
   * @param cat 猫エンティティ
   */
  stop(cat: Cat): void {
    cat.updateNightCryState({
      currentAction: null,
    });
  }
}
