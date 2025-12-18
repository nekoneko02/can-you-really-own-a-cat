/**
 * DialogSystem
 *
 * イベントテキストを表示するダイアログシステム。
 * MVP版はプレースホルダー（半透明黒矩形とテキスト）で実装。
 */

export class DialogSystem {
  private scene: Phaser.Scene;
  private background: Phaser.GameObjects.Graphics;
  private titleText: Phaser.GameObjects.Text;
  private descriptionText: Phaser.GameObjects.Text;
  private catStateText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    // 半透明黒矩形の背景（800x200px、下部に配置）
    this.background = scene.add.graphics();
    this.background.fillStyle(0x000000, 0.85);
    this.background.fillRect(0, 400, 800, 200);
    this.background.setVisible(false);

    // タイトルテキスト（24px、白色）
    this.titleText = scene.add.text(50, 420, '', {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial',
      wordWrap: { width: 700 },
    });
    this.titleText.setVisible(false);

    // 説明テキスト（18px、灰色）
    this.descriptionText = scene.add.text(50, 460, '', {
      fontSize: '18px',
      color: '#cccccc',
      fontFamily: 'Arial',
      wordWrap: { width: 700 },
    });
    this.descriptionText.setVisible(false);

    // 猫の様子テキスト（16px、黄色）
    this.catStateText = scene.add.text(50, 520, '', {
      fontSize: '16px',
      color: '#ffdd44',
      fontFamily: 'Arial',
      wordWrap: { width: 700 },
    });
    this.catStateText.setVisible(false);
  }

  /**
   * ダイアログを表示
   * @param title イベントタイトル
   * @param description イベント説明
   * @param catState 猫の様子（配列）
   */
  show(title: string, description: string, catState: string[]): void {
    this.titleText.setText(title);
    this.descriptionText.setText(description);

    // 猫の様子を改行で連結
    const catStateText = catState.join('\n');
    this.catStateText.setText(catStateText);

    this.background.setVisible(true);
    this.titleText.setVisible(true);
    this.descriptionText.setVisible(true);
    this.catStateText.setVisible(true);
  }

  /**
   * ダイアログを非表示
   */
  hide(): void {
    this.background.setVisible(false);
    this.titleText.setVisible(false);
    this.descriptionText.setVisible(false);
    this.catStateText.setVisible(false);
  }

  /**
   * ダイアログを破棄
   */
  destroy(): void {
    this.background.destroy();
    this.titleText.destroy();
    this.descriptionText.destroy();
    this.catStateText.destroy();
  }
}
