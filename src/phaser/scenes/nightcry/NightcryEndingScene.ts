/**
 * NightcryEndingScene
 *
 * 夜泣きシナリオのエンディングシーン。
 * 共通テキスト → 最後の問い → レポートボタン → Reactページへ遷移
 */

import Phaser from 'phaser';
import { DialogSystem, DialogData } from '@/phaser/ui/DialogSystem';
import { BaseButton } from '@/phaser/ui/components/BaseButton';
import { UILayout, UIColors } from '@/phaser/ui/UIConstants';
import type {
  NightcryScenarioState,
  NightcryReportData,
} from '@/domain/scenarios/nightcry/NightcryScenarioState';

/**
 * シーン起動パラメータ
 */
export interface NightcryEndingSceneParams {
  scenarioState: NightcryScenarioState;
}

/**
 * エンディングコンテンツ
 */
export interface EndingContent {
  commonText: string[];
  finalQuestion: string;
}

/**
 * 夜泣きシナリオ エンディングシーン
 */
export class NightcryEndingScene extends Phaser.Scene {
  private dialogSystem!: DialogSystem;
  private reportButton?: BaseButton;
  private scenarioState!: NightcryScenarioState;
  private background!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'NightcryEndingScene' });
  }

  /**
   * シーン初期化
   */
  init(data: NightcryEndingSceneParams): void {
    console.log('[NightcryEndingScene] 初期化開始', data);
    this.scenarioState = data?.scenarioState;
    console.log('[NightcryEndingScene] 初期化完了');
  }

  /**
   * シーン作成
   */
  create(): void {
    console.log('[NightcryEndingScene] シーン作成開始');

    // 背景を作成
    this.createBackground();

    // ダイアログシステムを初期化
    this.dialogSystem = new DialogSystem(this);

    // フェードインで開始
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // エンディングテキストを表示
    this.showEndingText();

    console.log('[NightcryEndingScene] シーン作成完了');
  }

  /**
   * 背景を作成
   */
  private createBackground(): void {
    this.background = this.add.graphics();
    this.background.fillStyle(0x0a0a1a, 1);
    this.background.fillRect(0, 0, UILayout.screen.width, UILayout.screen.height);

    // 星を表示
    this.createStars();
  }

  /**
   * 星を表示
   */
  private createStars(): void {
    const stars = this.add.graphics();
    stars.fillStyle(0xffffff, 0.6);

    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(0, UILayout.screen.width);
      const y = Phaser.Math.Between(0, UILayout.playArea.height);
      const radius = Phaser.Math.Between(1, 2);
      stars.fillCircle(x, y, radius);
    }
  }

  /**
   * エンディングコンテンツを取得
   */
  getEndingContent(): EndingContent {
    return {
      commonText: [
        'この体験は、ある一人の飼い主のものです。',
        'あなたが同じになるとは限りません。\nもちろん、ねこの性格次第なところもあります。',
        'ただ、多くの飼い主が夜泣きに苦労したという事実があります。',
      ],
      finalQuestion: 'この生活、あなたはどう感じましたか？',
    };
  }

  /**
   * エンディングテキストを表示
   */
  private showEndingText(): void {
    const content = this.getEndingContent();

    const dialogData: DialogData = {
      pages: content.commonText.map((text) => ({ text })),
    };

    this.dialogSystem.showPages(dialogData, () => {
      // 共通テキスト完了後、最後の問いを表示
      this.showFinalQuestion();
    });
  }

  /**
   * 最後の問いを表示
   */
  private showFinalQuestion(): void {
    const content = this.getEndingContent();

    const dialogData: DialogData = {
      pages: [{ text: content.finalQuestion }],
    };

    this.dialogSystem.showPages(dialogData, () => {
      // 問い表示完了後、ボタンを表示
      this.showReportButton();
    });
  }

  /**
   * レポートボタンを表示
   */
  private showReportButton(): void {
    this.dialogSystem.hide();

    const centerX = UILayout.screen.width / 2;
    const centerY = UILayout.screen.height / 2;

    this.reportButton = new BaseButton(
      this,
      centerX,
      centerY,
      'レポートを見る',
      () => {
        this.onReportButtonClick();
      },
      { size: 'primary', color: UIColors.primary }
    );
  }

  /**
   * レポートボタンクリック時の処理
   */
  private onReportButtonClick(): void {
    console.log('[NightcryEndingScene] レポートボタンクリック');

    // レポートデータを保存
    this.saveReportData();

    // フェードアウト後にレポートページへ遷移
    this.cameras.main.fadeOut(500, 0, 0, 0);

    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.navigateToReport();
    });
  }

  /**
   * レポートデータをlocalStorageに保存
   */
  saveReportData(): void {
    if (!this.scenarioState) {
      console.warn('[NightcryEndingScene] scenarioStateが未設定');
      return;
    }

    const reportData: NightcryReportData = {
      selections: this.scenarioState.selections,
    };

    localStorage.setItem('nightcryReportData', JSON.stringify(reportData));
    console.log('[NightcryEndingScene] レポートデータ保存完了', reportData);
  }

  /**
   * レポートページへ遷移
   */
  navigateToReport(): void {
    console.log('[NightcryEndingScene] レポートページへ遷移');
    window.location.href = '/nightcry-report';
  }

  /**
   * シーン破棄時のクリーンアップ
   */
  shutdown(): void {
    console.log('[NightcryEndingScene] シャットダウン');
    this.dialogSystem?.destroy();
    this.reportButton?.destroy();
  }
}
