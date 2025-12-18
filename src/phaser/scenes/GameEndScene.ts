/**
 * GameEndScene - ゲーム終了画面
 *
 * 責務:
 * - 1週間のプレイ完了を祝福
 * - 統計表示（総睡眠時間、起こされた回数など）
 * - 猫の最終状態表示
 * - 「レポートを見る」ボタン → ReactBridge経由でReactへ遷移
 * - 「もう一度プレイ」ボタン → BootSceneを再起動
 */

import Phaser from 'phaser';
import { PhaserGameController } from '../controllers/PhaserGameController';
import { ReactBridge } from '../bridge/ReactBridge';

/**
 * GameEndScene
 */
export class GameEndScene extends Phaser.Scene {
  private controller!: PhaserGameController;
  private reportButton?: Phaser.GameObjects.Zone;
  private replayButton?: Phaser.GameObjects.Zone;

  constructor() {
    super({ key: 'GameEndScene' });
  }

  /**
   * シーン初期化
   */
  init(): void {
    console.log('[GameEndScene] 初期化開始');

    // Registryからcontrollerを取得
    const gameController = this.registry.get('gameController');
    if (!gameController) {
      throw new Error('GameController not found in registry');
    }

    this.controller = new PhaserGameController(gameController);

    console.log('[GameEndScene] GameController取得完了');
  }

  /**
   * シーン作成
   */
  create(): void {
    console.log('[GameEndScene] シーン作成開始');

    // 背景（プレースホルダー: 白）
    this.createBackground();

    // タイトルテキスト
    this.createTitle();

    // 猫の最終状態表示
    this.createCatStatusDisplay();

    // プレイヤー統計表示
    this.createPlayerStatsDisplay();

    // 「レポートを見る」ボタン
    this.createReportButton();

    // 「もう一度プレイ」ボタン
    this.createReplayButton();

    console.log('[GameEndScene] シーン作成完了');
  }

  /**
   * 背景を作成（プレースホルダー）
   */
  private createBackground(): void {
    const bg = this.add.graphics();
    bg.fillStyle(0xf5f5f5, 1); // 薄い灰色
    bg.fillRect(0, 0, 800, 600);
  }

  /**
   * タイトルテキストを表示
   */
  private createTitle(): void {
    const titleText = this.add.text(400, 80, '1週間、お疲れさまでした！', {
      fontSize: '32px',
      color: '#333333',
      fontStyle: 'bold',
    });
    titleText.setOrigin(0.5, 0.5);

    const subText = this.add.text(
      400,
      130,
      'たまとの7日間を体験しました。',
      {
        fontSize: '20px',
        color: '#666666',
      }
    );
    subText.setOrigin(0.5, 0.5);
  }

  /**
   * 猫の最終状態を表示
   */
  private createCatStatusDisplay(): void {
    const gameView = this.controller.view();
    const catStatus = gameView.catStatus;

    // ボックス背景
    const box = this.add.graphics();
    box.fillStyle(0xffffff, 1);
    box.fillRoundedRect(100, 180, 600, 120, 10);
    box.lineStyle(2, 0xcccccc, 1);
    box.strokeRoundedRect(100, 180, 600, 120, 10);

    // タイトル
    const boxTitle = this.add.text(120, 200, 'たまの最終的な様子', {
      fontSize: '20px',
      color: '#333333',
      fontStyle: 'bold',
    });

    // 状態テキスト生成
    const statusTexts = this.generateCatStatusTexts(catStatus);
    const statusText = this.add.text(120, 235, statusTexts.join('\n'), {
      fontSize: '16px',
      color: '#555555',
      lineSpacing: 5,
    });
  }

  /**
   * プレイヤー統計を表示
   */
  private createPlayerStatsDisplay(): void {
    const gameView = this.controller.view();
    const playerStats = gameView.playerStats;

    // ボックス背景
    const box = this.add.graphics();
    box.fillStyle(0xffffff, 1);
    box.fillRoundedRect(100, 320, 600, 120, 10);
    box.lineStyle(2, 0xcccccc, 1);
    box.strokeRoundedRect(100, 320, 600, 120, 10);

    // タイトル
    const boxTitle = this.add.text(120, 340, 'あなたの1週間', {
      fontSize: '20px',
      color: '#333333',
      fontStyle: 'bold',
    });

    // 統計テキスト
    const statsText = this.add.text(
      120,
      375,
      [
        `総睡眠時間: ${playerStats.totalSleepHours}時間/49時間`,
        `起こされた回数: ${playerStats.interruptionCount}回`,
        `遊んだ回数: ${playerStats.playCount}回`,
      ].join('\n'),
      {
        fontSize: '16px',
        color: '#555555',
        lineSpacing: 5,
      }
    );
  }

  /**
   * 「レポートを見る」ボタンを作成
   */
  private createReportButton(): void {
    // ボタン背景（Graphics）
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(0x4a90e2, 1); // 青
    buttonBg.fillRoundedRect(250, 480, 300, 50, 10);

    // ボタンテキスト
    const buttonText = this.add.text(400, 505, 'レポートを見る', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    buttonText.setOrigin(0.5, 0.5);

    // インタラクティブゾーン
    this.reportButton = this.add.zone(400, 505, 300, 50);
    this.reportButton.setInteractive({ useHandCursor: true });

    // ホバー時の色変更
    this.reportButton.on('pointerover', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x6aa8f0, 1); // 明るい青
      buttonBg.fillRoundedRect(250, 480, 300, 50, 10);
    });

    this.reportButton.on('pointerout', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x4a90e2, 1); // 通常の青
      buttonBg.fillRoundedRect(250, 480, 300, 50, 10);
    });

    // クリックイベント
    this.reportButton.on('pointerdown', () => {
      console.log('[GameEndScene] レポートを見るボタンがクリックされました');
      this.onReportButtonClicked();
    });
  }

  /**
   * 「もう一度プレイ」ボタンを作成
   */
  private createReplayButton(): void {
    // ボタン背景（Graphics）
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(0x888888, 1); // 灰色
    buttonBg.fillRoundedRect(250, 550, 300, 40, 10);

    // ボタンテキスト
    const buttonText = this.add.text(400, 570, 'もう一度プレイ', {
      fontSize: '18px',
      color: '#ffffff',
    });
    buttonText.setOrigin(0.5, 0.5);

    // インタラクティブゾーン
    this.replayButton = this.add.zone(400, 570, 300, 40);
    this.replayButton.setInteractive({ useHandCursor: true });

    // ホバー時の色変更
    this.replayButton.on('pointerover', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0xaaaaaa, 1); // 明るい灰色
      buttonBg.fillRoundedRect(250, 550, 300, 40, 10);
    });

    this.replayButton.on('pointerout', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x888888, 1); // 通常の灰色
      buttonBg.fillRoundedRect(250, 550, 300, 40, 10);
    });

    // クリックイベント
    this.replayButton.on('pointerdown', () => {
      console.log('[GameEndScene] もう一度プレイボタンがクリックされました');
      this.onReplayButtonClicked();
    });
  }

  /**
   * 猫の状態テキストを生成
   */
  private generateCatStatusTexts(catStatus: any): string[] {
    const texts: string[] = [];

    // なつき度
    if (catStatus.affection >= 70) {
      texts.push('・とても懐いている');
    } else if (catStatus.affection >= 40) {
      texts.push('・まあまあ懐いている');
    } else {
      texts.push('・少し不安そうに見える');
    }

    // ストレス
    if (catStatus.stress >= 60) {
      texts.push('・落ち着きがなくなったようだ');
    } else if (catStatus.stress >= 30) {
      texts.push('・少しストレスを感じているようだ');
    } else {
      texts.push('・リラックスしている');
    }

    // 健康度
    if (catStatus.health >= 70) {
      texts.push('・元気そうだ');
    } else if (catStatus.health >= 40) {
      texts.push('・まあまあ元気だ');
    } else {
      texts.push('・少し体調が悪そうだ');
    }

    return texts;
  }

  /**
   * レポートを見るボタンがクリックされた時の処理
   */
  private onReportButtonClicked(): void {
    // ReactBridgeでReactへデータを送信
    ReactBridge.sendGameResult(this.controller);

    // Phaserゲームを破棄（Reactに制御を戻す）
    // TODO: ゲーム破棄処理を実装
    console.log('[GameEndScene] Reactへ遷移します');
  }

  /**
   * もう一度プレイボタンがクリックされた時の処理
   */
  private onReplayButtonClicked(): void {
    // BootSceneを再起動
    this.scene.start('BootScene', { scenarioId: 'night_crying' });
  }
}
