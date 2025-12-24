/**
 * ケア後の待機アクション
 *
 * 撫でる・遊ぶの後に一定時間待機し、その後MEOWINGに遷移します。
 */

import { Cat } from '@/domain/Cat';
import { CatState, CatMood } from '@/domain/types';
import { AutonomousAction } from '../AutonomousAction';
import { AutonomousActionType } from '../AutonomousActionType';
import { AutonomousActionConfig } from '../AutonomousActionConfig';

export class WaitingAfterCareAction implements AutonomousAction {
  readonly type = AutonomousActionType.WAITING_AFTER_CARE;

  start(cat: Cat, gameTime: number): void {
    cat.setState(CatState.SITTING);
    cat.setMood(CatMood.NEUTRAL);
    cat.updateAutonomousBehaviorState({
      currentAction: this.type,
      actionStartTime: gameTime,
    });
  }

  update(_cat: Cat, _gameTime: number): void {
    // 待機中は特に更新処理なし
  }

  isCompleted(cat: Cat, gameTime: number): boolean {
    const elapsed = gameTime - cat.autonomousBehaviorState.actionStartTime;
    return elapsed >= AutonomousActionConfig.waitingAfterCare.duration;
  }

  stop(cat: Cat): void {
    cat.updateAutonomousBehaviorState({ currentAction: null });
  }
}
