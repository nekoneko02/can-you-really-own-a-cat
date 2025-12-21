/**
 * おやつをあげるアクション
 *
 * プレイヤーがおやつをあげるアクションを表現します。
 * ただし、猫は見向きもせず、満足度に影響は与えません。
 */

import { Cat } from '@/domain/Cat';
import { NightCryActionType } from './NightCryActionType';

export class FeedingSnackAction {
  /**
   * アクションを開始
   * @param cat 猫エンティティ
   * @param gameTime 現在のゲーム時間（ミリ秒）
   */
  start(cat: Cat, gameTime: number): void {
    cat.updateNightCryState({
      currentAction: NightCryActionType.FEEDING_SNACK,
      actionStartTime: gameTime,
    });
  }

  /**
   * アクションを更新
   * @param cat 猫エンティティ
   * @param gameTime 現在のゲーム時間（ミリ秒）
   */
  update(cat: Cat, gameTime: number): void {
    // おやつをあげても満足度・諦め度は変化しない
    // 何もしない
  }

  /**
   * アクションが完了したか判定
   * @param cat 猫エンティティ
   * @returns 常に false（おやつでは完了しない）
   */
  isCompleted(cat: Cat): boolean {
    return false;
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
