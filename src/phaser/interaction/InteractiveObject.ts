/**
 * InteractiveObject
 *
 * インタラクト可能なオブジェクトの基底クラス。
 * テクスチャが存在する場合はSprite、存在しない場合はGraphicsで表示（フォールバック）。
 */

export interface InteractiveObjectConfig {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: number;
  radius?: number; // インタラクション範囲（デフォルト: 50px）
  textureKey?: string; // テクスチャキー（オプショナル）
}

export class InteractiveObject {
  public id: string;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public radius: number;

  protected scene: Phaser.Scene;
  protected sprite?: Phaser.GameObjects.Sprite;
  protected graphics?: Phaser.GameObjects.Graphics;
  protected color: number;
  protected isHighlighted: boolean = false;

  constructor(scene: Phaser.Scene, config: InteractiveObjectConfig) {
    this.scene = scene;
    this.id = config.id;
    this.x = config.x;
    this.y = config.y;
    this.width = config.width;
    this.height = config.height;
    this.color = config.color;
    this.radius = config.radius ?? 50;

    // テクスチャが存在する場合はSprite、存在しない場合はGraphics
    if (config.textureKey && scene.textures.exists(config.textureKey)) {
      this.sprite = scene.add.sprite(config.x, config.y, config.textureKey);
      this.sprite.setDisplaySize(config.width, config.height);
    } else {
      // フォールバック: Graphics
      this.graphics = scene.add.graphics();
      this.drawGraphics(this.color);
    }
  }

  /**
   * Graphics矩形を描画
   * @param color 矩形の色
   */
  protected drawGraphics(color: number): void {
    if (!this.graphics) return;

    this.graphics.clear();
    this.graphics.fillStyle(color, 1);
    this.graphics.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
  }

  /**
   * 位置を取得
   */
  getPosition(): { x: number; y: number } {
    if (this.sprite) {
      return { x: this.sprite.x, y: this.sprite.y };
    }
    return { x: this.x, y: this.y };
  }

  /**
   * オブジェクトをハイライト表示
   */
  highlight(): void {
    if (this.isHighlighted) return;

    this.isHighlighted = true;

    if (this.sprite) {
      // Sprite: setTint()を使用
      this.sprite.setTint(0xffffff);
    } else if (this.graphics) {
      // Graphics: 色を明るくする（+0x333333）
      const highlightColor = this.color + 0x333333;
      this.drawGraphics(highlightColor);
    }
  }

  /**
   * ハイライトを解除
   */
  unhighlight(): void {
    if (!this.isHighlighted) return;

    this.isHighlighted = false;

    if (this.sprite) {
      // Sprite: clearTint()を使用
      this.sprite.clearTint();
    } else if (this.graphics) {
      // Graphics: 元の色で再描画
      this.drawGraphics(this.color);
    }
  }

  /**
   * プレイヤーとの距離を計算
   * @param playerX プレイヤーのX座標
   * @param playerY プレイヤーのY座標
   */
  getDistanceFrom(playerX: number, playerY: number): number {
    const dx = this.x - playerX;
    const dy = this.y - playerY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * プレイヤーがインタラクト範囲内にいるかどうか
   * @param playerX プレイヤーのX座標
   * @param playerY プレイヤーのY座標
   */
  isInRange(playerX: number, playerY: number): boolean {
    return this.getDistanceFrom(playerX, playerY) <= this.radius;
  }

  /**
   * オブジェクトを破棄
   */
  destroy(): void {
    this.sprite?.destroy();
    this.graphics?.destroy();
  }
}
