/**
 * Toy - おもちゃオブジェクト
 *
 * 猫と遊ぶためのおもちゃ。
 * MVP版はプレースホルダー（黄色矩形）で実装。
 */

import { InteractiveObject } from '../InteractiveObject';

export class Toy extends InteractiveObject {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, {
      id: 'toy',
      x,
      y,
      width: 24,
      height: 24,
      color: 0xffd700, // 黄色
      radius: 50,
    });
  }
}
