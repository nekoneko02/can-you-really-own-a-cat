/**
 * ChoiceButton
 *
 * イベントの選択肢ボタン。
 * MVP版はプレースホルダー（Graphics製の角丸矩形）で実装。
 */

export class ChoiceButton {
  private scene: Phaser.Scene;
  private background: Phaser.GameObjects.Graphics;
  private text: Phaser.GameObjects.Text;
  private zone: Phaser.GameObjects.Zone;
  private x: number;
  private y: number;
  private width: number = 300;
  private height: number = 50;

  /**
   * @param scene Phaserシーン
   * @param x X座標（中心）
   * @param y Y座標（中心）
   * @param label ボタンのテキスト
   * @param onClick クリック時のコールバック
   */
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    label: string,
    onClick: () => void
  ) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    // ボタン背景（Graphics）
    this.background = scene.add.graphics();
    this.drawButton(0x666666);

    // ボタンテキスト
    this.text = scene.add.text(x, y, label, {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial',
    });
    this.text.setOrigin(0.5, 0.5);

    // インタラクティブゾーン
    this.zone = scene.add.zone(x, y, this.width, this.height);
    this.zone.setInteractive({ useHandCursor: true });

    // ホバー時の色変更
    this.zone.on('pointerover', () => {
      this.drawButton(0x888888);
    });

    this.zone.on('pointerout', () => {
      this.drawButton(0x666666);
    });

    // クリックイベント
    this.zone.on('pointerdown', onClick);
  }

  /**
   * ボタンを描画
   * @param color ボタンの色
   */
  private drawButton(color: number): void {
    this.background.clear();
    this.background.fillStyle(color, 1);
    this.background.fillRoundedRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height,
      10
    );
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
