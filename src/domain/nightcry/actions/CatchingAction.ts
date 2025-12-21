/**
 * 捕まえるアクション
 *
 * プレイヤーが猫を捕まえようとするアクションを表現します。
 * 捕まえる処理自体はPhaserレイヤーで実装されます。
 */

import { Cat } from '@/domain/Cat';
import { NightCryActionType } from './NightCryActionType';

export class CatchingAction {
  /**
   * アクションを開始
   * @param cat 猫エンティティ
   * @param gameTime 現在のゲーム時間（ミリ秒）
   */
  start(cat: Cat, gameTime: number): void {
    cat.updateNightCryState({
      currentAction: NightCryActionType.CATCHING,
      actionStartTime: gameTime,
    });
  }

  /**
   * アクションを更新
   * @param cat 猫エンティティ
   * @param gameTime 現在のゲーム時間（ミリ秒）
   */
  update(cat: Cat, gameTime: number): void {
    // 捕まえる処理はPhaserレイヤーで実装
    // 満足度・諦め度は変化しない
  }

  /**
   * アクションが完了したか判定
   * @param cat 猫エンティティ
   * @returns 常に false（捕まえただけでは完了しない）
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
