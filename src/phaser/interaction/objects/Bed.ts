/**
 * Bed - ベッドオブジェクト
 *
 * プレイヤーが寝る場所。
 * MVP版はプレースホルダー（茶色矩形）で実装。
 */

import { InteractiveObject } from '../InteractiveObject';

export class Bed extends InteractiveObject {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, {
      id: 'bed',
      x,
      y,
      width: 64,
      height: 48,
      color: 0x8b4513, // 茶色
      radius: 50,
    });
  }
}
