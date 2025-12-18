/**
 * InteractiveObject
 *
 * インタラクト可能なオブジェクトの基底クラス。
 * MVP版はプレースホルダー（色付き矩形）で実装。
 */

export interface InteractiveObjectConfig {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: number;
  radius?: number; // インタラクション範囲（デフォルト: 50px）
}

export class InteractiveObject {
  public id: string;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public radius: number;

  protected scene: Phaser.Scene;
  protected sprite: Phaser.GameObjects.Graphics;
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

    // プレースホルダースプライト（色付き矩形）
    this.sprite = scene.add.graphics();
    this.drawSprite(this.color);
  }

  /**
   * スプライトを描画
   * @param color 矩形の色
   */
  protected drawSprite(color: number): void {
    this.sprite.clear();
    this.sprite.fillStyle(color, 1);
    this.sprite.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
  }

  /**
   * オブジェクトをハイライト表示
   */
  highlight(): void {
    if (this.isHighlighted) return;

    this.isHighlighted = true;
    // 色を明るくする（+0x333333）
    const highlightColor = this.color + 0x333333;
    this.drawSprite(highlightColor);
  }

  /**
   * ハイライトを解除
   */
  unhighlight(): void {
    if (!this.isHighlighted) return;

    this.isHighlighted = false;
    this.drawSprite(this.color);
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
    this.sprite.destroy();
  }
}
