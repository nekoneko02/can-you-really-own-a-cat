/**
 * 鳴くアクション
 *
 * 猫が鳴くアクションを表現します。
 * 夜泣きイベント時に使用され、一定時間経過すると完了します。
 * 鳴く時間は履歴により変動します。
 * 定期的に「鳴く」イベントを発火し、Phaser層で効果音やアニメーションを再生可能にします。
 */

import { Cat } from '@/domain/Cat';
import { CatState } from '@/domain/types';
import { AutonomousAction } from '../AutonomousAction';
import { AutonomousActionType } from '../AutonomousActionType';
import { AutonomousActionConfig } from '../AutonomousActionConfig';

export class MeowingAction implements AutonomousAction {
  readonly type = AutonomousActionType.MEOWING;

  start(cat: Cat, gameTime: number): void {
    cat.setState(CatState.MEOWING);
    cat.updateAutonomousBehaviorState({
      currentAction: this.type,
      actionStartTime: gameTime,
      lastMeowTime: gameTime,
      meowCount: 0,
    });

    // 開始時に1回鳴く
    this.triggerMeow(cat, gameTime);
  }

  update(cat: Cat, gameTime: number): void {
    // 定期的に鳴く
    const timeSinceLastMeow = gameTime - cat.autonomousBehaviorState.lastMeowTime;
    if (timeSinceLastMeow >= AutonomousActionConfig.meowing.interval) {
      this.triggerMeow(cat, gameTime);
    }
  }

  isCompleted(cat: Cat, gameTime: number): boolean {
    const elapsed = gameTime - cat.autonomousBehaviorState.actionStartTime;
    // meowingDurationは履歴により変動する
    return elapsed >= cat.autonomousBehaviorState.meowingDuration;
  }

  stop(cat: Cat): void {
    cat.updateAutonomousBehaviorState({ currentAction: null });
  }

  /**
   * 鳴くイベントをトリガー
   * Phaser層でこの情報を使って効果音・アニメーションを再生できる
   */
  private triggerMeow(cat: Cat, gameTime: number): void {
    const newCount = cat.autonomousBehaviorState.meowCount + 1;
    cat.updateAutonomousBehaviorState({
      lastMeowTime: gameTime,
      meowCount: newCount,
    });
    console.log(`[MeowingAction] 猫が鳴いた！ (${newCount}回目)`);
  }
}
