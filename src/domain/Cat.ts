/**
 * 猫エンティティ
 *
 * ゲーム内の猫キャラクターを表現します。
 * 状態、気分、位置などを持ち、様々なアクションに反応します。
 */

import { CatState, CatMood, ToyType } from './types';

export interface CatParams {
  x?: number;
  y?: number;
  state?: CatState;
  mood?: CatMood;
}

export class Cat {
  public x: number;
  public y: number;
  public state: CatState;
  public mood: CatMood;

  constructor(params: CatParams = {}) {
    this.x = params.x ?? 0;
    this.y = params.y ?? 0;
    this.state = params.state ?? CatState.SLEEPING;
    this.mood = params.mood ?? CatMood.NEUTRAL;
  }

  /**
   * 猫の状態を変更する
   * @param state 新しい状態
   */
  public setState(state: CatState): void {
    this.state = state;
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
    this.x = x;
    this.y = y;
    this.state = CatState.WALKING;
  }

  /**
   * 猫を捕まえる
   * 猫は座った状態になり、不機嫌になる
   */
  public catch(): void {
    this.state = CatState.SITTING;
    this.mood = CatMood.ANGRY;
  }

  /**
   * 猫とおもちゃで遊ぶ
   * @param toyType おもちゃの種類
   */
  public playWith(toyType: ToyType): void {
    this.state = CatState.PLAYING;
    this.mood = CatMood.HAPPY;
    // おもちゃの種類は将来的に猫の反応を変えるために使用可能
  }

  /**
   * 猫を寝かせる
   */
  public sleep(): void {
    this.state = CatState.SLEEPING;
    this.mood = CatMood.SLEEPY;
  }
}
