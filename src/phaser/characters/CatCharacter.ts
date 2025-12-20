/**
 * CatCharacter
 *
 * 猫キャラクターの表示とアニメーション管理を担当します。
 */

import Phaser from 'phaser';
import { CatViewModel } from '@/application/types';

/**
 * 猫キャラクタークラス
 */
export class CatCharacter {
  private sprite: Phaser.GameObjects.Sprite;

  /**
   * コンストラクタ
   *
   * @param scene - Phaserシーン
   * @param x - 初期X座標
   * @param y - 初期Y座標
   * @param textureKey - テクスチャキー
   */
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    textureKey: string
  ) {
    this.sprite = scene.add.sprite(x, y, textureKey);
    this.sprite.setDepth(10); // キャラクターは前面に表示

    // 画像サイズに依らず一定のサイズで表示
    const scale = this.calculateScale(scene, textureKey);
    this.sprite.setScale(scale);

    // 初期アニメーションを再生
    if (scene.anims.exists(textureKey)) {
      this.sprite.play(textureKey);
    }
  }

  /**
   * GameViewから取得した状態でスプライトを更新
   *
   * @param viewModel - 猫のViewModel
   */
  update(viewModel: CatViewModel): void {
    // 位置を更新
    this.sprite.setPosition(viewModel.x, viewModel.y);

    // アニメーション更新
    this.updateAnimation(viewModel.animation);
  }

  /**
   * アニメーションを更新
   *
   * @param animationKey - 再生するアニメーションキー
   */
  private updateAnimation(animationKey: string): void {
    // 現在再生中のアニメーションと異なる場合のみ切り替え
    if (this.sprite.anims.currentAnim?.key !== animationKey) {
      // アニメーションが存在するか確認
      if (this.sprite.anims.exists(animationKey)) {
        this.sprite.play(animationKey);
      } else {
        console.warn(
          `[CatCharacter] アニメーション "${animationKey}" が存在しません`
        );
      }
    }
  }

  /**
   * 画像サイズに依らず一定のサイズで表示するためのスケールを計算
   *
   * @param scene - Phaserシーン
   * @param textureKey - テクスチャキー
   * @returns スケール値
   */
  private calculateScale(scene: Phaser.Scene, textureKey: string): number {
    // アニメーションの最初のフレームからテクスチャを取得
    const frameKey = `${textureKey}_frame_0`;
    let texture = scene.textures.get(frameKey);

    // フレームが存在しない場合は、元のキーで試す
    if (!texture || !texture.source || !texture.source[0]) {
      texture = scene.textures.get(textureKey);
    }

    const gameHeight = scene.sys.game.config.height as number;
    const targetSizeRatio = 0.2; // ゲーム高さの20%（120px）
    const targetSize = gameHeight * targetSizeRatio;
    let scale = 1.0;

    if (texture && texture.source && texture.source[0]) {
      const originalWidth = texture.source[0].width;
      const originalHeight = texture.source[0].height;
      const maxDimension = Math.max(originalWidth, originalHeight);
      scale = targetSize / maxDimension;
    }

    return scale;
  }

  /**
   * スプライトを取得
   *
   * @returns Phaserスプライト
   */
  getSprite(): Phaser.GameObjects.Sprite {
    return this.sprite;
  }

  /**
   * スプライトを破棄
   */
  destroy(): void {
    this.sprite.destroy();
  }
}
