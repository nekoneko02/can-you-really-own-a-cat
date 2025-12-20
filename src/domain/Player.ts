/**
 * プレイヤーエンティティ
 *
 * ゲーム内のプレイヤーキャラクターを表現します。
 * 移動、インタラクション、アイテム保持などの機能を持ちます。
 */

import { Direction } from './types';

// 移動速度（ピクセル単位）
const MOVE_SPEED = 10;

export interface PlayerParams {
  x?: number;
  y?: number;
}

export class Player {
  public x: number;
  public y: number;
  public currentAnimation: string;
  public hasToy: boolean;

  constructor(params: PlayerParams = {}) {
    this.x = params.x ?? 0;
    this.y = params.y ?? 0;
    this.currentAnimation = 'player_idle';
    this.hasToy = false;
  }

  /**
   * プレイヤーを移動させる
   * @param direction 移動方向
   */
  public move(direction: Direction): void {
    switch (direction) {
      case Direction.UP:
        this.y -= MOVE_SPEED;
        this.currentAnimation = 'player_walk_up';
        break;
      case Direction.DOWN:
        this.y += MOVE_SPEED;
        this.currentAnimation = 'player_walk_down';
        break;
      case Direction.LEFT:
        this.x -= MOVE_SPEED;
        this.currentAnimation = 'player_walk_left';
        break;
      case Direction.RIGHT:
        this.x += MOVE_SPEED;
        this.currentAnimation = 'player_walk_right';
        break;
      case Direction.NONE:
        this.currentAnimation = 'player_idle';
        break;
    }
  }

  /**
   * おもちゃを拾う
   */
  public pickUpToy(): void {
    this.hasToy = true;
    this.currentAnimation = 'player_interact';
  }

  /**
   * おもちゃを置く
   */
  public dropToy(): void {
    this.hasToy = false;
  }

  /**
   * 対象とインタラクトする
   * @param targetId 対象のID（疎結合のため文字列で指定）
   */
  public interact(targetId: string): void {
    this.currentAnimation = 'player_interact';
    // 実際のインタラクション処理はGameEventやGameControllerで行う
  }
}
