import Phaser from 'phaser';

/**
 * 翌朝メッセージUI
 *
 * イベント完了後、翌朝の状況を表示するUIです。
 */
export class MorningMessageUI {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
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
      fontSize: '18px',
      color: '#000000',
      align: 'center',
      wordWrap: { width: 500 },
    });
    text.setOrigin(0.5);
    this.container.add(text);

    // 「次へ」ボタン
    const button = this.scene.add.rectangle(400, 420, 120, 40, 0x4CAF50);
    button.setInteractive({ useHandCursor: true });
    this.container.add(button);

    const buttonText = this.scene.add.text(400, 420, '次へ', {
      fontSize: '20px',
      color: '#ffffff',
    });
    buttonText.setOrigin(0.5);
    this.container.add(buttonText);

    button.on('pointerdown', () => {
      this.submit();
    });
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
