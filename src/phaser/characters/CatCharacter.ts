/**
 * CatCharacter
 *
 * 猫キャラクターの表示とアニメーション管理を担当します。
 */

import Phaser from 'phaser';
import { CatViewModel } from '@/application/types';
import { CharacterScaleCalculator } from '@/phaser/utils/CharacterScaleCalculator';
import { AnimationPlayer } from '@/phaser/utils/AnimationPlayer';

/**
 * 猫キャラクタークラス
 */
export class CatCharacter {
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
    this.sprite.setDepth(10); // キャラクターは前面に表示

    // スケール計算（動的）
    const scale = CharacterScaleCalculator.calculate(scene, textureKey, 0.2);
    this.sprite.setScale(scale);

    // 物理ボディを追加（壁衝突判定のため）
    scene.physics.add.existing(this.sprite);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.setCollideWorldBounds(true); // 画面外に出ないようにする
    }

    // 初期アニメーション再生（安全）
    AnimationPlayer.play(this.sprite, scene, textureKey, '[CatCharacter]');
  }

  /**
   * GameViewから取得した状態でスプライトを更新
   *
   * @param viewModel - 猫のViewModel
   */
  update(viewModel: CatViewModel): void {
    // 表示状態を更新
    this.sprite.setVisible(viewModel.isVisible);

    // 非表示の場合は位置・アニメーション更新をスキップ
    if (!viewModel.isVisible) {
      return;
    }

    // 位置を更新
    this.sprite.setPosition(viewModel.x, viewModel.y);

    // アニメーション更新
    this.updateAnimation(viewModel.animation);
  }

  /**
   * 表示状態を設定
   *
   * @param visible - 表示するかどうか
   */
  setVisible(visible: boolean): void {
    this.sprite.setVisible(visible);
  }

  /**
   * アニメーションを更新
   *
   * @param animationKey - 再生するアニメーションキー
   */
  private updateAnimation(animationKey: string): void {
    AnimationPlayer.play(this.sprite, this.scene, animationKey, '[CatCharacter]');
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
