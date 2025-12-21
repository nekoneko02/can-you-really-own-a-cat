/**
 * 撫でるアクション
 *
 * プレイヤーが猫を撫でるアクションを表現します。
 * 5分間撫でると満足度がMaxになります。
 */

import { Cat } from '@/domain/Cat';
import { NightCryActionType } from './NightCryActionType';
import { NightCryTimeConstants } from '../constants/TimeConstants';
import { SatisfactionCalculator } from '../calculators/SatisfactionCalculator';

export class PettingAction {
  private satisfactionCalculator: SatisfactionCalculator;

  constructor() {
    this.satisfactionCalculator = new SatisfactionCalculator();
  }

  /**
   * アクションを開始
   * @param cat 猫エンティティ
   * @param gameTime 現在のゲーム時間（ミリ秒）
   */
  start(cat: Cat, gameTime: number): void {
    cat.updateNightCryState({
      currentAction: NightCryActionType.PETTING,
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
    const maxTime = NightCryTimeConstants.PETTING_DURATION;

    const satisfaction = this.satisfactionCalculator.calculate(elapsedTime, maxTime);

    cat.updateNightCryState({
      satisfaction,
    });
  }

  /**
   * アクションが完了したか判定
   * @param cat 猫エンティティ
   * @returns 完了している場合 true
   */
  isCompleted(cat: Cat): boolean {
    return cat.nightCryState.satisfaction >= 1.0;
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
