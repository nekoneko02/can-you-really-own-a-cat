/**
 * StatusDisplay
 *
 * 猫のステータスバーを表示します（なつき度、ストレス、健康度、空腹度）。
 * MVP版はプレースホルダー（色付き矩形バー）で実装。
 */

import { CatStatus } from '@/domain/CatStatus';

interface StatusBarConfig {
  label: string;
  icon: string;
  color: number;
  y: number;
}

export class StatusDisplay {
  private scene: Phaser.Scene;
  private x: number;
  private y: number;

  private statusBars: Map<string, StatusBar> = new Map();
  private catNameText?: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number = 600, y: number = 20) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    // 猫の名前表示（初期値は空）
    this.catNameText = scene.add.text(x, y - 10, '', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'Arial',
      fontStyle: 'bold',
    });

    // ステータスバーの定義（猫の名前分だけ下にずらす）
    const configs: StatusBarConfig[] = [
      { label: 'なつき度', icon: '❤️', color: 0xff6b9d, y: 20 },
      { label: 'ストレス', icon: '😰', color: 0xffaa00, y: 50 },
      { label: '健康度', icon: '💚', color: 0x4caf50, y: 80 },
      { label: '空腹度', icon: '🍽️', color: 0xffd54f, y: 110 },
    ];

    // ステータスバーを生成
    configs.forEach((config) => {
      const bar = new StatusBar(
        scene,
        x,
        y + config.y,
        config.label,
        config.icon,
        config.color
      );
      this.statusBars.set(config.label, bar);
    });
  }

  /**
   * ステータスバーを更新
   * @param catStatus 猫のステータス
   * @param catName 猫の名前（オプション）
   */
  update(catStatus: CatStatus, catName?: string): void {
    // 猫の名前を更新
    if (catName && this.catNameText) {
      this.catNameText.setText(`🐱 ${catName}`);
    }

    // なつき度
    this.statusBars.get('なつき度')?.update(catStatus.affection);

    // ストレス
    this.statusBars.get('ストレス')?.update(catStatus.stress);

    // 健康度
    this.statusBars.get('健康度')?.update(catStatus.health);

    // 空腹度
    this.statusBars.get('空腹度')?.update(catStatus.hunger);
  }

  /**
   * ステータス表示を破棄
   */
  destroy(): void {
    this.catNameText?.destroy();
    this.statusBars.forEach((bar) => bar.destroy());
    this.statusBars.clear();
  }
}

/**
 * 個別のステータスバー
 */
class StatusBar {
  private scene: Phaser.Scene;
  private x: number;
  private y: number;
  private barWidth: number = 100;
  private barHeight: number = 15;
  private color: number;

  private background: Phaser.GameObjects.Graphics;
  private fill: Phaser.GameObjects.Graphics;
  private labelText: Phaser.GameObjects.Text;
  private valueText: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    label: string,
    icon: string,
    color: number
  ) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.color = color;

    // ラベルテキスト（アイコン + ラベル名）
    this.labelText = scene.add.text(x, y - 5, `${icon} ${label}`, {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'Arial',
    });

    // バーの背景（暗灰色）
    this.background = scene.add.graphics();
    this.background.fillStyle(0x333333, 1);
    this.background.fillRect(x, y + 15, this.barWidth, this.barHeight);

    // バーの塗りつぶし（色付き）
    this.fill = scene.add.graphics();

    // 値テキスト（バーの右側）
    this.valueText = scene.add.text(x + this.barWidth + 10, y + 12, '0', {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'Arial',
    });
  }

  /**
   * ステータスバーを更新
   * @param value ステータス値（0-100）
   */
  update(value: number): void {
    // 値を0-100の範囲にクランプ
    const clampedValue = Math.max(0, Math.min(100, value));

    // バーの長さを計算
    const fillWidth = (this.barWidth * clampedValue) / 100;

    // バーを再描画
    this.fill.clear();
    this.fill.fillStyle(this.color, 1);
    this.fill.fillRect(this.x, this.y + 15, fillWidth, this.barHeight);

    // 値テキストを更新
    this.valueText.setText(clampedValue.toString());
  }

  /**
   * ステータスバーを破棄
   */
  destroy(): void {
    this.background.destroy();
    this.fill.destroy();
    this.labelText.destroy();
    this.valueText.destroy();
  }
}
