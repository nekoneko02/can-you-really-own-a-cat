/**
 * Bed - ベッドオブジェクト
 *
 * プレイヤーが寝る場所。
 * 画像アセットが存在する場合はSpriteで表示、存在しない場合はGraphicsでフォールバック。
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
      color: 0x8b4513, // 茶色（フォールバック用）
      radius: 50,
      textureKey: 'bed', // 画像アセットキー
    });
  }
}
