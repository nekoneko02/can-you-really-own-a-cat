/**
 * ProgressIndicator
 *
 * ゲームの進行状況を表示します（Day、時刻、フェーズ）。
 * MVP版はプレースホルダー（テキスト表示）で実装。
 */

import { GamePhase } from '@/domain/types';

export class ProgressIndicator {
  private scene: Phaser.Scene;
  private x: number;
  private y: number;

  private dayText: Phaser.GameObjects.Text;
  private timeText: Phaser.GameObjects.Text;
  private phaseText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number = 20, y: number = 20) {
    this.scene = scene;
    this.x = x;
    this.y = y;

    // Day表示
    this.dayText = scene.add.text(x, y, '', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    });

    // 時刻表示
    this.timeText = scene.add.text(x, y + 35, '', {
      fontSize: '18px',
      color: '#cccccc',
      fontFamily: 'Arial',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    });

    // フェーズ表示
    this.phaseText = scene.add.text(x, y + 70, '', {
      fontSize: '16px',
      color: '#aaaaaa',
      fontFamily: 'Arial',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
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

    // フェーズ表示（日本語）
    const phaseName = this.getPhaseNameJa(phase);
    this.phaseText.setText(phaseName);
  }

  /**
   * フェーズ名を日本語に変換
   * @param phase ゲームフェーズ
   */
  private getPhaseNameJa(phase: GamePhase): string {
    switch (phase) {
      case GamePhase.NIGHT_PREP:
        return '夜（就寝準備）';
      case GamePhase.MIDNIGHT_EVENT:
        return '夜中（イベント）';
      case GamePhase.MORNING_OUTRO:
        return '朝（振り返り）';
      case GamePhase.GAME_END:
        return 'ゲーム終了';
      default:
        return '';
    }
  }

  /**
   * 進行状況表示を破棄
   */
  destroy(): void {
    this.dayText.destroy();
    this.timeText.destroy();
    this.phaseText.destroy();
  }
}
