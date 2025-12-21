/**
 * BaseButton
 *
 * 共通ボタンコンポーネント。
 * UIConstants の定義に基づいたスタイル統一ボタン。
 */

import Phaser from 'phaser';
import { UIColors, UIFonts, UIButtonSizes } from '../UIConstants';

export type ButtonSize = 'choice' | 'primary' | 'secondary';

export interface BaseButtonOptions {
  size?: ButtonSize;
  color?: number;
  hoverColor?: number;
}

export class BaseButton {
  private scene: Phaser.Scene;
  private background: Phaser.GameObjects.Graphics;
  private text: Phaser.GameObjects.Text;
  private zone: Phaser.GameObjects.Zone;
  private x: number;
  private y: number;
  private sizeConfig: { width: number; height: number; radius: number };
  private normalColor: number;
  private hoverColor: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    label: string,
    onClick: () => void,
    options: BaseButtonOptions = {}
  ) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    const size = options.size ?? 'choice';
    this.sizeConfig = UIButtonSizes[size];
    this.normalColor = options.color ?? UIColors.primary;
    this.hoverColor = options.hoverColor ?? UIColors.primaryHover;

    // 背景
    this.background = scene.add.graphics();
    this.drawButton(this.normalColor);

    // テキスト
    this.text = scene.add.text(x, y, label, {
      fontSize: UIFonts.button,
      color: '#ffffff',
      fontFamily: UIFonts.family,
    });
    this.text.setOrigin(0.5, 0.5);

    // インタラクティブゾーン
    this.zone = scene.add.zone(x, y, this.sizeConfig.width, this.sizeConfig.height);
    this.zone.setInteractive({ useHandCursor: true });

    this.zone.on('pointerover', () => this.drawButton(this.hoverColor));
    this.zone.on('pointerout', () => this.drawButton(this.normalColor));
    this.zone.on('pointerdown', onClick);
  }

  private drawButton(color: number): void {
    this.background.clear();
    this.background.fillStyle(color, 1);
    this.background.fillRoundedRect(
      this.x - this.sizeConfig.width / 2,
      this.y - this.sizeConfig.height / 2,
      this.sizeConfig.width,
      this.sizeConfig.height,
      this.sizeConfig.radius
    );
  }

  /**
   * ボタンの表示/非表示を設定
   */
  setVisible(visible: boolean): void {
    this.background.setVisible(visible);
    this.text.setVisible(visible);
    this.zone.setVisible(visible);
  }

  /**
   * ボタンを破棄
   */
  destroy(): void {
    this.background.destroy();
    this.text.destroy();
    this.zone.destroy();
  }
}
