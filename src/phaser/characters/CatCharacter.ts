/**
 * CatCharacter
 *
 * 猫キャラクターの表示とアニメーション管理を担当します。
 * MVP版ではプレースホルダースプライト（オレンジ色矩形32x32px）を使用。
 * 状態に応じて色を変更します（仮実装）。
 */

import Phaser from 'phaser';
import { CatViewModel } from '@/application/types';
import { CatState, CatMood } from '@/domain/types';

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
    this.sprite.setDisplaySize(32, 32); // 猫サイズ
  }

  /**
   * GameViewから取得した状態でスプライトを更新
   *
   * @param viewModel - 猫のViewModel
   */
  update(viewModel: CatViewModel): void {
    // 位置を更新
    this.sprite.setPosition(viewModel.x, viewModel.y);

    // 状態に応じた色変更（仮実装）
    this.updateTint(viewModel.state, viewModel.mood);

    // アニメーション更新（将来実装）
    // TODO: viewModel.stateに基づいてアニメーションを再生
  }

  /**
   * 状態と気分に応じてティント（色）を変更
   *
   * MVP版の仮実装として、状態・気分を視覚化します。
   *
   * @param state - 猫の状態
   * @param mood - 猫の気分
   */
  private updateTint(state: CatState, mood: CatMood): void {
    // デフォルト: オレンジ色
    let tint = 0xffa500;

    // 気分に応じた色変更
    switch (mood) {
      case CatMood.HAPPY:
        tint = 0xffff00; // 黄色（嬉しい）
        break;
      case CatMood.ANGRY:
        tint = 0xff0000; // 赤色（怒っている）
        break;
      case CatMood.SCARED:
        tint = 0x8b008b; // 紫色（怖がっている）
        break;
      case CatMood.SLEEPY:
        tint = 0x4682b4; // 青色（眠い）
        break;
      case CatMood.NEUTRAL:
      default:
        tint = 0xffa500; // オレンジ色（普通）
        break;
    }

    // 状態が眠っている場合は暗くする
    if (state === CatState.SLEEPING) {
      tint = 0x696969; // 暗い灰色
    }

    this.sprite.setTint(tint);
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
