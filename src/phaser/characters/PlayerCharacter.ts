/**
 * PlayerCharacter
 *
 * プレイヤーキャラクターの表示とアニメーション管理を担当します。
 * MVP版ではプレースホルダースプライト（青色矩形32x48px）を使用。
 */

import Phaser from 'phaser';
import { PlayerViewModel } from '@/application/types';
import { CharacterScaleCalculator } from '@/phaser/utils/CharacterScaleCalculator';
import { AnimationPlayer } from '@/phaser/utils/AnimationPlayer';

/**
 * プレイヤーキャラクタークラス
 */
export class PlayerCharacter {
  private sprite: Phaser.GameObjects.Sprite;
  private scene: Phaser.Scene;

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
    this.scene = scene;
    this.sprite = scene.add.sprite(x, y, textureKey);

    // スケール計算（動的）
    const scale = CharacterScaleCalculator.calculate(scene, textureKey, 0.2);
    this.sprite.setScale(scale);

    // 初期アニメーション再生（安全）
    AnimationPlayer.play(this.sprite, scene, textureKey, '[PlayerCharacter]');
  }

  /**
   * GameViewから取得した状態でスプライトを更新
   *
   * @param viewModel - プレイヤーのViewModel
   */
  update(viewModel: PlayerViewModel): void {
    // 位置を更新
    this.sprite.setPosition(viewModel.x, viewModel.y);

    // アニメーション更新
    this.updateAnimation(viewModel.animation);
  }

  /**
   * アニメーションを更新
   *
   * @param animationKey - アニメーションキー
   */
  private updateAnimation(animationKey: string): void {
    AnimationPlayer.play(this.sprite, this.scene, animationKey, '[PlayerCharacter]');
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
