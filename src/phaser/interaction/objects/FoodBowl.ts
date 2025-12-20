/**
 * FoodBowl - 餌皿オブジェクト
 *
 * 猫の餌を置く場所。
 * 画像アセットが存在する場合はSpriteで表示、存在しない場合はGraphicsでフォールバック。
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
      color: 0xffd700, // 金色（フォールバック用、Issue #4に従い変更）
      radius: 50,
      textureKey: 'food_bowl', // 画像アセットキー
    });
  }
}
