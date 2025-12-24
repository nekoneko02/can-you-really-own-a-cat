/**
 * 締め出し中アクション
 *
 * 猫が部屋の外に締め出されている状態を表現します。
 * 猫は非表示になり、ユーザーが「部屋に戻す」を選択するまで継続します。
 */

import { Cat } from '@/domain/Cat';
import { CatState } from '@/domain/types';
import { AutonomousAction } from '../AutonomousAction';
import { AutonomousActionType } from '../AutonomousActionType';

export class LockedOutAction implements AutonomousAction {
  readonly type = AutonomousActionType.LOCKED_OUT;

  start(cat: Cat, gameTime: number): void {
    cat.setState(CatState.SITTING);
    cat.setVisible(false);
    cat.updateAutonomousBehaviorState({
      currentAction: this.type,
      actionStartTime: gameTime,
    });
  }

  update(_cat: Cat, _gameTime: number): void {
    // 締め出し中は特に更新処理なし
    // 累積時間はAutonomousBehaviorManagerで管理
  }

  isCompleted(_cat: Cat, _gameTime: number): boolean {
    // ユーザー操作（部屋に戻す）まで継続するため、自動完了しない
    return false;
  }

  stop(cat: Cat): void {
    cat.setVisible(true);
    cat.updateAutonomousBehaviorState({ currentAction: null });
  }
}
