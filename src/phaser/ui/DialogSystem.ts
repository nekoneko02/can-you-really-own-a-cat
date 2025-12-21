/**
 * DialogSystem
 *
 * イベントテキストを表示するダイアログシステム。
 * テキスト送り機能（ページ送り）対応。
 */

import { UIColors, UIFonts, UILayout } from './UIConstants';

/**
 * ダイアログ表示用のページデータ
 */
export interface DialogPage {
  text: string; // 表示するテキスト
  style?: 'normal' | 'highlight'; // スタイル（オプション）
}

/**
 * ダイアログ表示用のデータ
 */
export interface DialogData {
  pages: DialogPage[]; // ページの配列（シナリオ側で自由に分割可能）
}

export class DialogSystem {
  private scene: Phaser.Scene;
  private background: Phaser.GameObjects.Graphics;
  private contentText: Phaser.GameObjects.Text;
  private indicatorText: Phaser.GameObjects.Text;
  private dialogZone: Phaser.GameObjects.Zone;

  // ページ送り用
  private pages: DialogPage[] = [];
  private currentPageIndex: number = 0;
  private onComplete?: () => void;
  private isVisible: boolean = false;

  // レガシーモード用（旧show互換）
  private legacyMode: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    // 半透明黒矩形の背景（800x120px、下部に配置）
    this.background = scene.add.graphics();
    this.background.fillStyle(UIColors.dialogBg, UIColors.dialogBgAlpha);
    this.background.fillRect(
      UILayout.dialogArea.x,
      UILayout.dialogArea.y,
      UILayout.dialogArea.width,
      UILayout.dialogArea.height
    );
    this.background.setVisible(false);

    // コンテンツテキスト（18px、白色）
    this.contentText = scene.add.text(UILayout.dialog.textX, UILayout.dialog.textY, '', {
      fontSize: UIFonts.body,
      color: '#ffffff',
      fontFamily: UIFonts.family,
      wordWrap: { width: UILayout.dialog.textWidth },
    });
    this.contentText.setVisible(false);

    // 進行インジケーター（▼マーク）
    this.indicatorText = scene.add.text(
      UILayout.dialog.indicatorX,
      UILayout.dialog.indicatorY,
      '▼ [Enter]',
      {
        fontSize: UIFonts.indicator,
        color: '#aaaaaa',
        fontFamily: UIFonts.family,
      }
    );
    this.indicatorText.setOrigin(1, 1);
    this.indicatorText.setVisible(false);

    // ダイアログエリア用のインタラクティブゾーン
    this.dialogZone = scene.add.zone(
      UILayout.dialogArea.x + UILayout.dialogArea.width / 2,
      UILayout.dialogArea.y + UILayout.dialogArea.height / 2,
      UILayout.dialogArea.width,
      UILayout.dialogArea.height
    );
    this.dialogZone.setInteractive({ useHandCursor: true });
    this.dialogZone.setVisible(false);

    // 入力ハンドラを設定
    this.setupInputHandlers();
  }

  /**
   * 入力ハンドラの設定
   */
  private setupInputHandlers(): void {
    // Enterキー
    this.scene.input.keyboard?.on('keydown-ENTER', () => {
      if (this.isVisible && !this.legacyMode) {
        this.next();
      }
    });

    // クリック（ダイアログエリア内）
    this.dialogZone.on('pointerdown', () => {
      if (this.isVisible && !this.legacyMode) {
        this.next();
      }
    });
  }

  /**
   * ダイアログを表示（新方式：ページ配列）
   * @param data ダイアログデータ（ページ配列）
   * @param onComplete 全ページ表示完了時のコールバック
   */
  showPages(data: DialogData, onComplete?: () => void): void {
    this.legacyMode = false;
    this.pages = data.pages;
    this.currentPageIndex = 0;
    this.onComplete = onComplete;
    this.isVisible = true;
    this.dialogZone.setVisible(true);
    this.showCurrentPage();
  }

  /**
   * 現在のページを表示
   */
  private showCurrentPage(): void {
    const page = this.pages[this.currentPageIndex];
    if (!page) return;

    // スタイルに応じた色を設定
    const color = page.style === 'highlight' ? '#ffdd44' : '#ffffff';
    this.contentText.setStyle({ color });
    this.contentText.setText(page.text);

    this.background.setVisible(true);
    this.contentText.setVisible(true);

    // 最終ページでなければインジケーターを表示
    if (!this.isLastPage()) {
      this.indicatorText.setVisible(true);
    } else {
      this.indicatorText.setVisible(false);
    }
  }

  /**
   * 次のページへ進む
   */
  next(): void {
    if (this.currentPageIndex < this.pages.length - 1) {
      this.currentPageIndex++;
      this.showCurrentPage();
    } else {
      // 最終ページの場合は完了コールバック
      this.onComplete?.();
    }
  }

  /**
   * 最終ページかどうか
   */
  isLastPage(): boolean {
    return this.currentPageIndex >= this.pages.length - 1;
  }

  /**
   * ダイアログを表示（レガシー互換）
   * @param title イベントタイトル
   * @param description イベント説明
   * @param catState 猫の様子（配列）
   */
  show(title: string, description: string, catState: string[]): void {
    this.legacyMode = true;
    this.isVisible = true;
    this.dialogZone.setVisible(false); // レガシーモードではクリック送りは無効

    // 猫の様子を改行で連結
    const catStateText = catState.length > 0 ? '\n\n' + catState.join('\n') : '';

    // タイトルと説明を連結して表示
    let fullText = '';
    if (title) {
      fullText = `【${title}】\n\n${description}${catStateText}`;
    } else {
      fullText = `${description}${catStateText}`;
    }

    this.contentText.setStyle({ color: '#ffffff' });
    this.contentText.setText(fullText);

    this.background.setVisible(true);
    this.contentText.setVisible(true);
    this.indicatorText.setVisible(false);
  }

  /**
   * ダイアログを非表示
   */
  hide(): void {
    this.isVisible = false;
    this.legacyMode = false;
    this.background.setVisible(false);
    this.contentText.setVisible(false);
    this.indicatorText.setVisible(false);
    this.dialogZone.setVisible(false);
  }

  /**
   * ダイアログを破棄
   */
  destroy(): void {
    this.background.destroy();
    this.contentText.destroy();
    this.indicatorText.destroy();
    this.dialogZone.destroy();
  }
}
