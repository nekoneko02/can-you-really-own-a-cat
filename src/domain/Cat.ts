/**
 * 猫エンティティ
 *
 * ゲーム内の猫キャラクターを表現します。
 * 状態、気分、位置などを持ち、様々なアクションに反応します。
 */

import { CatState, CatMood, ToyType } from './types';

// 画面境界（ピクセル単位）
const WORLD_BOUNDS = {
  minX: 50,
  maxX: 750,
  minY: 50,
  maxY: 550,
};

export interface CatParams {
  name?: string;
  x?: number;
  y?: number;
  state?: CatState;
  mood?: CatMood;
}

export class Cat {
  public name: string;
  public x: number;
  public y: number;
  public state: CatState;
  public mood: CatMood;
  public currentAnimation: string;

  constructor(params: CatParams = {}) {
    this.name = params.name ?? 'たま';
    this.x = params.x ?? 0;
    this.y = params.y ?? 0;
    this.state = params.state ?? CatState.SLEEPING;
    this.mood = params.mood ?? CatMood.NEUTRAL;
    this.currentAnimation = this.getAnimationForState(this.state);
  }

  /**
   * 猫の状態を変更する
   * @param state 新しい状態
   */
  public setState(state: CatState): void {
    this.state = state;
    this.currentAnimation = this.getAnimationForState(state);
  }

  /**
   * 猫の気分を変更する
   * @param mood 新しい気分
   */
  public setMood(mood: CatMood): void {
    this.mood = mood;
  }

  /**
   * 猫を指定位置に移動させる
   * @param x X座標
   * @param y Y座標
   */
  public moveTo(x: number, y: number): void {
    // 画面境界チェック
    if (x >= WORLD_BOUNDS.minX && x <= WORLD_BOUNDS.maxX) {
      this.x = x;
    }
    if (y >= WORLD_BOUNDS.minY && y <= WORLD_BOUNDS.maxY) {
      this.y = y;
    }
    this.setState(CatState.WALKING);
  }

  /**
   * 猫を捕まえる
   * 猫は座った状態になり、不機嫌になる
   */
  public catch(): void {
    this.setState(CatState.SITTING);
    this.mood = CatMood.ANGRY;
  }

  /**
   * 猫とおもちゃで遊ぶ
   * @param toyType おもちゃの種類
   */
  public playWith(toyType: ToyType): void {
    this.setState(CatState.PLAYING);
    this.mood = CatMood.HAPPY;
    // おもちゃの種類は将来的に猫の反応を変えるために使用可能
  }

  /**
   * 猫を寝かせる
   */
  public sleep(): void {
    this.setState(CatState.SLEEPING);
    this.mood = CatMood.SLEEPY;
  }

  /**
   * 状態からアニメーションキーを取得
   * @param state 猫の状態
   * @returns アニメーションキー
   */
  private getAnimationForState(state: CatState): string {
    switch (state) {
      case CatState.SLEEPING:
        return 'cat_sleeping';
      case CatState.SITTING:
        return 'cat_sitting';
      case CatState.STANDING:
        return 'cat_standing';
      case CatState.WALKING:
        return 'cat_walking';
      case CatState.RUNNING:
        return 'cat_running';
      case CatState.PLAYING:
        return 'cat_playing';
      case CatState.MEOWING:
        return 'cat_meowing';
      default:
        return 'cat_sitting';
    }
  }
}
