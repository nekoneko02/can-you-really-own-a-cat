/**
 * 歩き回るアクション
 *
 * 猫が歩き回るアクションを表現します。
 * 一定時間経過すると完了し、次のアクションへ遷移可能になります。
 */

import { Cat } from '@/domain/Cat';
import { CatState } from '@/domain/types';
import { AutonomousAction } from '../AutonomousAction';
import { AutonomousActionType } from '../AutonomousActionType';
import { AutonomousActionConfig } from '../AutonomousActionConfig';

/** 画面境界 */
const WORLD_BOUNDS = {
  minX: 100,
  maxX: 700,
  minY: 200,
  maxY: 500,
};

/** ランダムな目標位置を生成 */
function generateRandomTarget(): { x: number; y: number } {
  return {
    x: WORLD_BOUNDS.minX + Math.random() * (WORLD_BOUNDS.maxX - WORLD_BOUNDS.minX),
    y: WORLD_BOUNDS.minY + Math.random() * (WORLD_BOUNDS.maxY - WORLD_BOUNDS.minY),
  };
}

export class WanderingAction implements AutonomousAction {
  readonly type = AutonomousActionType.WANDERING;

  private targetX: number = 0;
  private targetY: number = 0;
  private lastTargetChangeTime: number = 0;

  start(cat: Cat, gameTime: number): void {
    cat.setState(CatState.WALKING);
    cat.updateAutonomousBehaviorState({
      currentAction: this.type,
      actionStartTime: gameTime,
    });

    // 初期目標位置を設定
    const target = generateRandomTarget();
    this.targetX = target.x;
    this.targetY = target.y;
    this.lastTargetChangeTime = gameTime;
  }

  update(cat: Cat, gameTime: number): void {
    // 一定間隔で目標位置を変更
    if (
      gameTime - this.lastTargetChangeTime >=
      AutonomousActionConfig.wandering.targetChangeInterval
    ) {
      const target = generateRandomTarget();
      this.targetX = target.x;
      this.targetY = target.y;
      this.lastTargetChangeTime = gameTime;
    }

    // 目標位置に向かって移動
    const dx = this.targetX - cat.x;
    const dy = this.targetY - cat.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 5) {
      // 移動量を計算（フレームレート非依存のため、固定の移動量を使用）
      const moveAmount = AutonomousActionConfig.wandering.moveSpeed * 0.016; // 約16ms（60fps想定）
      const ratio = Math.min(moveAmount / distance, 1);

      const newX = cat.x + dx * ratio;
      const newY = cat.y + dy * ratio;

      // 境界内に収める
      cat.x = Math.max(WORLD_BOUNDS.minX, Math.min(WORLD_BOUNDS.maxX, newX));
      cat.y = Math.max(WORLD_BOUNDS.minY, Math.min(WORLD_BOUNDS.maxY, newY));
    }
  }

  isCompleted(cat: Cat, gameTime: number): boolean {
    const elapsed = gameTime - cat.autonomousBehaviorState.actionStartTime;
    return elapsed >= AutonomousActionConfig.wandering.duration;
  }

  stop(cat: Cat): void {
    cat.updateAutonomousBehaviorState({ currentAction: null });
  }
}
