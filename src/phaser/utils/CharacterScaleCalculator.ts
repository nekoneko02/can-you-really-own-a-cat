/**
 * CharacterScaleCalculator
 *
 * キャラクターのスケール計算を行うユーティリティクラスです。
 * ゲーム画面サイズに対する相対的なスケール値を計算します。
 */

import Phaser from 'phaser';

/**
 * キャラクタースケール計算クラス
 */
export class CharacterScaleCalculator {
  /**
   * ゲーム画面サイズに対する相対的なスケール値を計算
   *
   * @param scene - Phaserシーン
   * @param textureKey - テクスチャキー
   * @param targetSizeRatio - 目標サイズ比率（デフォルト: 0.2 = 20%）
   * @returns スケール値
   */
  static calculate(
    scene: Phaser.Scene,
    textureKey: string,
    targetSizeRatio: number = 0.2
  ): number {
    // アニメーションの最初のフレームからテクスチャを取得
    const frameKey = `${textureKey}_frame_0`;
    let texture = scene.textures.get(frameKey);

    // フレームが存在しない場合は、元のキーで試す
    if (!texture || !texture.source || !texture.source[0]) {
      texture = scene.textures.get(textureKey);
    }

    const gameHeight = scene.sys.game.config.height as number;
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
}
