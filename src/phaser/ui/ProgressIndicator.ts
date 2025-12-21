/**
 * ProgressIndicator
 *
 * ゲームの進行状況を表示します（Day、時刻）。
 * UIConstantsを使用した共通コンポーネント。
 */

import { GamePhase } from '@/domain/types';
import { UIColors, UIFonts } from './UIConstants';

export class ProgressIndicator {
  private scene: Phaser.Scene;
  private x: number;
  private y: number;

  private container: Phaser.GameObjects.Graphics;
  private dayText: Phaser.GameObjects.Text;
  private timeText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number = 20, y: number = 20) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    // 背景コンテナ（半透明黒）
    this.container = scene.add.graphics();
    this.container.fillStyle(UIColors.dialogBg, 0.7);
    this.container.fillRoundedRect(x, y, 120, 55, 8);

    // Day表示
    this.dayText = scene.add.text(x + 10, y + 8, '', {
      fontSize: UIFonts.titleMedium,
      color: '#ffffff',
      fontFamily: UIFonts.family,
    });

    // 時刻表示
    this.timeText = scene.add.text(x + 10, y + 32, '', {
      fontSize: UIFonts.body,
      color: '#cccccc',
      fontFamily: UIFonts.family,
    });
  }

  /**
   * 進行状況を更新
   * @param day 日数
   * @param time 時刻（HHMM形式）
   * @param phase ゲームフェーズ
   */
  update(day: number, time: number, phase: GamePhase): void {
    // Day表示
    this.dayText.setText(`Day ${day}`);

    // 時刻表示（HHMM形式 -> "HH:MM"形式）
    const hours = Math.floor(time / 100);
    const minutes = time % 100;
    const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    this.timeText.setText(timeStr);
  }

  /**
   * 表示/非表示を設定
   */
  setVisible(visible: boolean): void {
    this.container.setVisible(visible);
    this.dayText.setVisible(visible);
    this.timeText.setVisible(visible);
  }

  /**
   * 進行状況表示を破棄
   */
  destroy(): void {
    this.container.destroy();
    this.dayText.destroy();
    this.timeText.destroy();
  }
}
