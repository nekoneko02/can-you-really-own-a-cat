/**
 * PlayerCharacter
 *
 * プレイヤーキャラクターの表示とアニメーション管理を担当します。
 * MVP版ではプレースホルダースプライト（青色矩形32x48px）を使用。
 */

import Phaser from 'phaser';
import { PlayerViewModel } from '@/application/types';

/**
 * プレイヤーキャラクタークラス
 */
export class PlayerCharacter {
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
    this.sprite.setDisplaySize(32, 48); // プレイヤーサイズ
  }

  /**
   * GameViewから取得した状態でスプライトを更新
   *
   * @param viewModel - プレイヤーのViewModel
   */
  update(viewModel: PlayerViewModel): void {
    // 位置を更新
    this.sprite.setPosition(viewModel.x, viewModel.y);

    // アニメーション更新（将来実装）
    // 現在は位置のみ更新
    // TODO: viewModel.animationに基づいてアニメーションを再生
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
