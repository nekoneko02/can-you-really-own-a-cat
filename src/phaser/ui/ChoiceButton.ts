/**
 * ChoiceButton
 *
 * イベントの選択肢ボタン。
 * BaseButtonをラップして選択肢用のサイズとスタイルを適用。
 */

import { BaseButton } from './components/BaseButton';

export class ChoiceButton {
  private button: BaseButton;

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
    this.button = new BaseButton(scene, x, y, label, onClick, {
      size: 'choice',
    });
  }

  /**
   * ボタンの表示/非表示を設定
   */
  setVisible(visible: boolean): void {
    this.button.setVisible(visible);
  }

  /**
   * ボタンを破棄
   */
  destroy(): void {
    this.button.destroy();
  }
}
