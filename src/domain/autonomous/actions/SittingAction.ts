/**
 * 座るアクション
 *
 * 猫が座っているアクションを表現します。
 * 一定時間経過すると完了し、次のアクションへ遷移可能になります。
 */

import { Cat } from '@/domain/Cat';
import { CatState } from '@/domain/types';
import { AutonomousAction } from '../AutonomousAction';
import { AutonomousActionType } from '../AutonomousActionType';
import { AutonomousActionConfig } from '../AutonomousActionConfig';

export class SittingAction implements AutonomousAction {
  readonly type = AutonomousActionType.SITTING;

  start(cat: Cat, gameTime: number): void {
    cat.setState(CatState.SITTING);
    cat.updateAutonomousBehaviorState({
      currentAction: this.type,
      actionStartTime: gameTime,
    });
  }

  update(_cat: Cat, _gameTime: number): void {
    // 座るアクションは特に更新処理なし
  }

  isCompleted(cat: Cat, gameTime: number): boolean {
    const elapsed = gameTime - cat.autonomousBehaviorState.actionStartTime;
    return elapsed >= AutonomousActionConfig.sitting.duration;
  }

  stop(cat: Cat): void {
    cat.updateAutonomousBehaviorState({ currentAction: null });
  }
}
