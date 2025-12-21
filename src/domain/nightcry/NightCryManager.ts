/**
 * 夜泣きイベント管理クラス
 *
 * 夜泣きイベント全体の状態遷移とアクション管理を担当します。
 */

import { Cat } from '@/domain/Cat';
import { NightCryActionType } from './actions/NightCryActionType';
import { PlayingAction } from './actions/PlayingAction';
import { PettingAction } from './actions/PettingAction';
import { FeedingSnackAction } from './actions/FeedingSnackAction';
import { IgnoringAction } from './actions/IgnoringAction';
import { CatchingAction } from './actions/CatchingAction';
import { LockedOutAction } from './actions/LockedOutAction';

export class NightCryManager {
  private playingAction: PlayingAction;
  private pettingAction: PettingAction;
  private feedingSnackAction: FeedingSnackAction;
  private ignoringAction: IgnoringAction;
  private catchingAction: CatchingAction;
  private lockedOutAction: LockedOutAction;

  constructor() {
    this.playingAction = new PlayingAction();
    this.pettingAction = new PettingAction();
    this.feedingSnackAction = new FeedingSnackAction();
    this.ignoringAction = new IgnoringAction();
    this.catchingAction = new CatchingAction();
    this.lockedOutAction = new LockedOutAction();
  }

  /**
   * アクションを開始
   * @param cat 猫エンティティ
   * @param actionType アクションタイプ
   * @param gameTime 現在のゲーム時間（ミリ秒）
   */
  startAction(cat: Cat, actionType: NightCryActionType, gameTime: number): void {
    const action = this.getAction(actionType);
    action.start(cat, gameTime);
  }

  /**
   * 現在のアクションを更新
   * @param cat 猫エンティティ
   * @param gameTime 現在のゲーム時間（ミリ秒）
   */
  update(cat: Cat, gameTime: number): void {
    const currentAction = cat.nightCryState.currentAction;
    if (!currentAction) {
      return;
    }

    const action = this.getAction(currentAction);
    action.update(cat, gameTime);
  }

  /**
   * 現在のアクションを停止
   * @param cat 猫エンティティ
   */
  stopCurrentAction(cat: Cat): void {
    const currentAction = cat.nightCryState.currentAction;
    if (!currentAction) {
      return;
    }

    const action = this.getAction(currentAction);
    action.stop(cat);
  }

  /**
   * 夜泣きイベントが完了したか判定
   * @param cat 猫エンティティ
   * @returns 完了している場合 true
   */
  isCompleted(cat: Cat): boolean {
    return cat.nightCryState.satisfaction >= 1.0 || cat.nightCryState.resignation >= 1.0;
  }

  /**
   * 再び鳴き始める必要があるか判定
   * @param cat 猫エンティティ
   * @returns 再び鳴く必要がある場合 true
   */
  shouldRestartCrying(cat: Cat): boolean {
    return !this.isCompleted(cat);
  }

  /**
   * 夜泣き状態をリセット
   * @param cat 猫エンティティ
   */
  reset(cat: Cat): void {
    cat.resetNightCryState();
  }

  /**
   * アクションタイプから対応するアクションインスタンスを取得
   * @param actionType アクションタイプ
   * @returns アクションインスタンス
   */
  private getAction(
    actionType: NightCryActionType
  ):
    | PlayingAction
    | PettingAction
    | FeedingSnackAction
    | IgnoringAction
    | CatchingAction
    | LockedOutAction {
    switch (actionType) {
      case NightCryActionType.PLAYING:
        return this.playingAction;
      case NightCryActionType.PETTING:
        return this.pettingAction;
      case NightCryActionType.FEEDING_SNACK:
        return this.feedingSnackAction;
      case NightCryActionType.IGNORING:
        return this.ignoringAction;
      case NightCryActionType.CATCHING:
        return this.catchingAction;
      case NightCryActionType.LOCKED_OUT:
        return this.lockedOutAction;
      default:
        throw new Error(`Unknown action type: ${actionType}`);
    }
  }
}
