/**
 * FoodBowl - 餌皿オブジェクト
 *
 * 猫の餌を置く場所。
 * MVP版はプレースホルダー（灰色矩形）で実装。
 */

import { InteractiveObject } from '../InteractiveObject';

export class FoodBowl extends InteractiveObject {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, {
      id: 'foodbowl',
      x,
      y,
      width: 32,
      height: 32,
      color: 0x808080, // 灰色
      radius: 50,
    });
  }
}
