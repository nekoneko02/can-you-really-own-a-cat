'use client';

import * as Phaser from 'phaser';
import { logError, logInfo } from '@/lib/log';

/**
 * GameAnimationScene
 *
 * 設計原則（シーケンス図準拠）:
 * - 背景画像の読み込み
 * - 猫のイラストの読み込み
 * - エフェクトの準備
 * - Scenarioは呼び出さない（UIロジックなし）
 */
export default class GameAnimationScene extends Phaser.Scene {
  private catSprite?: Phaser.GameObjects.Image;
  private backgroundImage?: Phaser.GameObjects.Image;

  constructor() {
    super({ key: 'GameAnimationScene' });
    logInfo('GameAnimationScene: Constructor called');
  }

  /**
   * アセット読み込み
   */
  preload() {
    logInfo('GameAnimationScene: preload() started');

    try {
      // 猫のイラスト（静止画）
      this.load.image('cat-idle', '/assets/cats/idle.png');
      this.load.image('cat-happy', '/assets/cats/play_1.png');
      this.load.image('cat-sad', '/assets/cats/scared_1.png');

      logInfo('GameAnimationScene: preload() completed');
    } catch (error) {
      logError('GameAnimationScene: Failed to load assets', {
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * シーン作成
   */
  create() {
    logInfo('GameAnimationScene: create() started');

    // 背景
    this.createBackground();

    // 猫のイラスト
    this.createCatSprite();

    logInfo('GameAnimationScene: create() completed');
  }

  /**
   * 背景作成
   */
  private createBackground() {
    // 背景色（空色）
    this.cameras.main.setBackgroundColor('#87CEEB');

    // 背景画像（もし読み込まれていれば）
    if (this.textures.exists('background')) {
      this.backgroundImage = this.add.image(400, 150, 'background');
      this.backgroundImage.setDisplaySize(800, 300);
    }
  }

  /**
   * 猫スプライト作成
   */
  private createCatSprite() {
    // 中央に猫を配置
    const catKey = this.textures.exists('cat-idle') ? 'cat-idle' : 'cat-happy';

    if (this.textures.exists(catKey)) {
      this.catSprite = this.add.image(400, 150, catKey);
      this.catSprite.setScale(0.4); // サイズ調整
    } else {
      logInfo('GameAnimationScene: Cat sprite not found, using placeholder');
      // プレースホルダー（円）
      const graphics = this.add.graphics();
      graphics.fillStyle(0xff9999, 1);
      graphics.fillCircle(400, 150, 40);
    }
  }

  /**
   * 猫のアニメーション（スプライト切り替え）
   */
  private playCatAnimation(spriteKey: 'cat-idle' | 'cat-happy' | 'cat-sad') {
    if (!this.catSprite || !this.textures.exists(spriteKey)) {
      logInfo('GameAnimationScene: Cat sprite or texture not found', { spriteKey });
      return;
    }

    // スプライトのテクスチャを変更
    this.catSprite.setTexture(spriteKey);

    // 簡単なバウンスアニメーション
    this.tweens.add({
      targets: this.catSprite,
      scaleX: 0.45,
      scaleY: 0.45,
      duration: 200,
      yoyo: true,
      ease: 'Bounce.easeOut'
    });

    logInfo('GameAnimationScene: Playing cat animation', { spriteKey });
  }

  /**
   * 猫を通常状態に（外部から呼ばれる）
   */
  setCatIdle() {
    this.playCatAnimation('cat-idle');
  }

  /**
   * 猫を嬉しい状態に（外部から呼ばれる）
   */
  setCatHappy() {
    this.playCatAnimation('cat-happy');
  }

  /**
   * 猫を悲しい状態に（外部から呼ばれる）
   */
  setCatSad() {
    this.playCatAnimation('cat-sad');
  }
}
