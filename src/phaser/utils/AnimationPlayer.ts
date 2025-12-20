/**
 * AnimationPlayer
 *
 * スプライトのアニメーションを安全に再生するユーティリティクラスです。
 * アニメーションの存在確認、重複再生の防止、エラー時のログ出力を行います。
 */

import Phaser from 'phaser';

/**
 * アニメーション再生クラス
 */
export class AnimationPlayer {
  /**
   * アニメーションを安全に再生
   * - 存在確認
   * - 重複再生の防止
   * - エラー時のログ出力
   *
   * @param sprite - 対象スプライト
   * @param scene - Phaserシーン（アニメーション存在確認用）
   * @param animationKey - アニメーションキー
   * @param logPrefix - ログのプレフィックス（例: "[PlayerCharacter]"）
   */
  static play(
    sprite: Phaser.GameObjects.Sprite,
    scene: Phaser.Scene,
    animationKey: string,
    logPrefix: string
  ): void {
    // 現在再生中のアニメーションと異なる場合のみ切り替え
    if (sprite.anims.currentAnim?.key !== animationKey) {
      // アニメーションが存在するか確認（scene.anims.exists を使用）
      if (scene.anims.exists(animationKey)) {
        sprite.play(animationKey);
      } else {
        console.warn(
          `${logPrefix} アニメーション "${animationKey}" が存在しません`
        );
      }
    }
  }
}
