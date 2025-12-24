/**
 * 逃げるアクション
 *
 * プレイヤーから遠ざかる方向に移動します。
 * 捕まるか画面端に到達するまで継続します。
 */

import { Cat } from '@/domain/Cat';
import { CatState, CatMood } from '@/domain/types';
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

export class FleeingAction implements AutonomousAction {
  readonly type = AutonomousActionType.FLEEING;

  private playerX: number = 400;
  private playerY: number = 300;

  start(cat: Cat, gameTime: number): void {
    cat.setState(CatState.RUNNING);
    cat.setMood(CatMood.SCARED);
    cat.updateAutonomousBehaviorState({
      currentAction: this.type,
      actionStartTime: gameTime,
    });
  }

  /**
   * プレイヤー位置を設定
   */
  setPlayerPosition(x: number, y: number): void {
    this.playerX = x;
    this.playerY = y;
  }

  update(cat: Cat, _gameTime: number): void {
    // プレイヤーから遠ざかる方向を計算
    const dx = cat.x - this.playerX;
    const dy = cat.y - this.playerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 1) {
      // プレイヤーと同じ位置の場合、ランダムな方向に逃げる
      const angle = Math.random() * Math.PI * 2;
      const moveAmount = AutonomousActionConfig.fleeing.moveSpeed * 0.016;
      const newX = cat.x + Math.cos(angle) * moveAmount;
      const newY = cat.y + Math.sin(angle) * moveAmount;
      cat.x = Math.max(WORLD_BOUNDS.minX, Math.min(WORLD_BOUNDS.maxX, newX));
      cat.y = Math.max(WORLD_BOUNDS.minY, Math.min(WORLD_BOUNDS.maxY, newY));
      return;
    }

    // プレイヤーから遠ざかる方向に移動
    const moveAmount = AutonomousActionConfig.fleeing.moveSpeed * 0.016;
    const ratio = moveAmount / distance;

    const newX = cat.x + dx * ratio;
    const newY = cat.y + dy * ratio;

    // 境界内に収める
    cat.x = Math.max(WORLD_BOUNDS.minX, Math.min(WORLD_BOUNDS.maxX, newX));
    cat.y = Math.max(WORLD_BOUNDS.minY, Math.min(WORLD_BOUNDS.maxY, newY));
  }

  isCompleted(cat: Cat, _gameTime: number): boolean {
    // プレイヤーから十分離れたら完了
    const dx = cat.x - this.playerX;
    const dy = cat.y - this.playerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance >= AutonomousActionConfig.fleeing.minDistanceFromPlayer;
  }

  stop(cat: Cat): void {
    cat.setMood(CatMood.NEUTRAL);
    cat.updateAutonomousBehaviorState({ currentAction: null });
  }
}
