/**
 * 一人遊びアクション
 *
 * 猫が一人で遊ぶアクションを表現します。
 * ユーザーが「やめる」を選択するまで継続し、自動遷移しません。
 */

import { Cat } from '@/domain/Cat';
import { CatState, CatMood } from '@/domain/types';
import { AutonomousAction } from '../AutonomousAction';
import { AutonomousActionType } from '../AutonomousActionType';

export class IdlePlayingAction implements AutonomousAction {
  readonly type = AutonomousActionType.IDLE_PLAYING;

  start(cat: Cat, gameTime: number): void {
    cat.setState(CatState.PLAYING);
    cat.setMood(CatMood.HAPPY);
    cat.updateAutonomousBehaviorState({
      currentAction: this.type,
      actionStartTime: gameTime,
    });
  }

  update(_cat: Cat, _gameTime: number): void {
    // 一人遊びアクションは特に更新処理なし
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
