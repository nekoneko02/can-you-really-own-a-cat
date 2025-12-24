/**
 * 眠るアクション
 *
 * 猫が眠るアクションを表現します。
 * 無期限で継続し、外部からの割り込みで終了します。
 */

import { Cat } from '@/domain/Cat';
import { CatState, CatMood } from '@/domain/types';
import { AutonomousAction } from '../AutonomousAction';
import { AutonomousActionType } from '../AutonomousActionType';

export class SleepingAction implements AutonomousAction {
  readonly type = AutonomousActionType.SLEEPING;

  start(cat: Cat, gameTime: number): void {
    cat.setState(CatState.SLEEPING);
    cat.setMood(CatMood.SLEEPY);
    cat.updateAutonomousBehaviorState({
      currentAction: this.type,
      actionStartTime: gameTime,
    });
  }

  update(_cat: Cat, _gameTime: number): void {
    // 眠るアクションは特に更新処理なし
  }

  isCompleted(_cat: Cat, _gameTime: number): boolean {
    // 眠るアクションは自然には終了しない（外部からの割り込みで終了）
    return false;
  }

  stop(cat: Cat): void {
    cat.updateAutonomousBehaviorState({ currentAction: null });
  }
}
