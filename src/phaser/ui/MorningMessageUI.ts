import Phaser from 'phaser';
import { UIColors, UIFonts } from './UIConstants';
import { BaseButton } from './components/BaseButton';

/**
 * 翌朝メッセージUI
 *
 * イベント完了後、翌朝の状況を表示するUIです。
 */
export class MorningMessageUI {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private nextButton?: BaseButton;
  private onComplete?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setVisible(false);
    this.container.setDepth(1000); // 最前面に表示
  }

  /**
   * 翌朝メッセージを表示
   */
  public show(message: string, onComplete: () => void): void {
    this.onComplete = onComplete;
    this.createUI(message);
    this.container.setVisible(true);
  }

  /**
   * UIを非表示
   */
  public hide(): void {
    this.container.setVisible(false);
    this.container.removeAll(true);
    if (this.nextButton) {
      this.nextButton.destroy();
      this.nextButton = undefined;
    }
  }

  /**
   * UIを構築
   */
  private createUI(message: string): void {
    // 背景（半透明の黒）
    const bg = this.scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
    this.container.add(bg);

    // パネル背景
    const panel = this.scene.add.rectangle(400, 300, 600, 400, 0xffffff);
    this.container.add(panel);

    // メッセージテキスト（複数行対応）
    const text = this.scene.add.text(400, 260, message, {
      fontSize: UIFonts.body,
      color: '#000000',
      align: 'center',
      fontFamily: UIFonts.family,
      wordWrap: { width: 500 },
    });
    text.setOrigin(0.5);
    this.container.add(text);

    // 「次へ」ボタン（BaseButtonを使用）
    this.nextButton = new BaseButton(
      this.scene,
      400,
      420,
      '次へ',
      () => this.submit(),
      { size: 'secondary', color: UIColors.accent }
    );
  }

  /**
   * 「次へ」を実行
   */
  private submit(): void {
    if (this.onComplete) {
      this.onComplete();
    }
    this.hide();
  }
}
