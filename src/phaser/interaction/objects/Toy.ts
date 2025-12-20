/**
 * Toy - おもちゃオブジェクト
 *
 * 猫と遊ぶためのおもちゃ。
 * 画像アセットが存在する場合はSpriteで表示、存在しない場合はGraphicsでフォールバック。
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
      color: 0xff69b4, // ピンク（フォールバック用、Issue #4に従い変更）
      radius: 50,
      textureKey: 'toy_ball', // 画像アセットキー
    });
  }
}
