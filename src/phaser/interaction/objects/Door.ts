/**
 * Door - ドアオブジェクト
 *
 * プレイヤーがインタラクトすると「仕事に行く」処理を実行します。
 * MorningPhaseScene で使用されます。
 */

import { InteractiveObject } from '../InteractiveObject';

export class Door extends InteractiveObject {
  private onInteractCallback?: () => void;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    onInteract?: () => void
  ) {
    super(scene, {
      id: 'door',
      x,
      y,
      width: 48,
      height: 80,
      color: 0x8b4513, // 茶色（フォールバック用）
      radius: 60,
      textureKey: 'door',
    });

    this.onInteractCallback = onInteract;
  }

  /**
   * インタラクト時のコールバックを設定
   */
  setOnInteract(callback: () => void): void {
    this.onInteractCallback = callback;
  }

  /**
   * インタラクトを実行
   */
  interact(): void {
    if (this.onInteractCallback) {
      this.onInteractCallback();
    }
  }
}
