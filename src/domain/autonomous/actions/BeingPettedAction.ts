/**
 * 撫でられ中アクション
 *
 * プレイヤーに撫でられている状態を表現します。
 * ユーザーが「やめる」を選択するまで継続し、自動遷移しません。
 */

import { Cat } from '@/domain/Cat';
import { CatState, CatMood } from '@/domain/types';
import { AutonomousAction } from '../AutonomousAction';
import { AutonomousActionType } from '../AutonomousActionType';

export class BeingPettedAction implements AutonomousAction {
  readonly type = AutonomousActionType.BEING_PETTED;

  start(cat: Cat, gameTime: number): void {
    cat.setState(CatState.SITTING);
    cat.setMood(CatMood.HAPPY);
    cat.updateAutonomousBehaviorState({
      currentAction: this.type,
      actionStartTime: gameTime,
    });
  }

  update(_cat: Cat, _gameTime: number): void {
    // 撫でられ中は特に更新処理なし
    // 累積時間はAutonomousBehaviorManagerで管理
  }

  isCompleted(_cat: Cat, _gameTime: number): boolean {
    // ユーザー操作（やめる）まで継続するため、自動完了しない
    return false;
  }

  stop(cat: Cat): void {
    cat.setMood(CatMood.NEUTRAL);
    cat.updateAutonomousBehaviorState({ currentAction: null });
  }
}
