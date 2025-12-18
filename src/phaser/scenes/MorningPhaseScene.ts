/**
 * MorningPhaseScene - 朝フェーズ画面
 *
 * 責務:
 * - 朝の状況を伝え、次の日へ進む
 * - 睡眠時間表示（GameViewから取得）
 * - 「出勤する」ボタンで次の日 or GameEndSceneへ遷移
 */

import Phaser from 'phaser';
import { PhaserGameController } from '../controllers/PhaserGameController';
import { GamePhase } from '@/domain/types';

/**
 * MorningPhaseScene
 */
export class MorningPhaseScene extends Phaser.Scene {
  private controller!: PhaserGameController;
  private goToWorkButton?: Phaser.GameObjects.Zone;

  constructor() {
    super({ key: 'MorningPhaseScene' });
  }

  /**
   * シーン初期化
   */
  init(): void {
    console.log('[MorningPhaseScene] 初期化開始');

    // Registryからcontrollerを取得
    const gameController = this.registry.get('gameController');
    if (!gameController) {
      throw new Error('GameController not found in registry');
    }

    this.controller = new PhaserGameController(gameController);

    console.log('[MorningPhaseScene] GameController取得完了');
  }

  /**
   * シーン作成
   */
  create(): void {
    console.log('[MorningPhaseScene] シーン作成開始');

    // 背景（プレースホルダー: 薄黄色）
    this.createBackground();

    // テキスト表示
    this.createText();

    // 睡眠時間表示
    this.createSleepTimeDisplay();

    // 「出勤する」ボタン
    this.createGoToWorkButton();

    console.log('[MorningPhaseScene] シーン作成完了');
  }

  /**
   * 背景を作成（プレースホルダー）
   */
  private createBackground(): void {
    const bg = this.add.graphics();
    bg.fillStyle(0xfffacd, 1); // 薄黄色
    bg.fillRect(0, 0, 800, 600);
  }

  /**
   * テキストを表示
   */
  private createText(): void {
    const text = this.add.text(400, 180, '寝不足だ...', {
      fontSize: '28px',
      color: '#333333',
      align: 'center',
    });
    text.setOrigin(0.5, 0.5);

    const subText = this.add.text(
      400,
      230,
      'でも仕事に行かなければ。',
      {
        fontSize: '20px',
        color: '#555555',
        align: 'center',
      }
    );
    subText.setOrigin(0.5, 0.5);
  }

  /**
   * 睡眠時間表示を作成
   */
  private createSleepTimeDisplay(): void {
    // GameViewから睡眠時間を取得（TODO: 実際の睡眠時間ロジック）
    const gameView = this.controller.view();
    const sleepHours = this.calculateSleepHours();

    const sleepTimeText = this.add.text(
      400,
      300,
      `💤 あなたの睡眠時間: ${sleepHours}時間`,
      {
        fontSize: '22px',
        color: '#444444',
        align: 'center',
      }
    );
    sleepTimeText.setOrigin(0.5, 0.5);

    // 睡眠時間が少ない場合の警告
    if (sleepHours < 5) {
      const warningText = this.add.text(
        400,
        340,
        '⚠️ 睡眠不足です',
        {
          fontSize: '18px',
          color: '#cc0000',
          align: 'center',
        }
      );
      warningText.setOrigin(0.5, 0.5);
    }
  }

  /**
   * 睡眠時間を計算（仮実装）
   */
  private calculateSleepHours(): number {
    // TODO: GameViewから実際の睡眠時間を取得
    // 現在は仮の値を返す
    return 4;
  }

  /**
   * 「出勤する」ボタンを作成
   */
  private createGoToWorkButton(): void {
    // ボタン背景（Graphics）
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(0x666666, 1);
    buttonBg.fillRoundedRect(300, 420, 200, 50, 10);

    // ボタンテキスト
    const buttonText = this.add.text(400, 445, '出勤する', {
      fontSize: '24px',
      color: '#ffffff',
    });
    buttonText.setOrigin(0.5, 0.5);

    // インタラクティブゾーン
    this.goToWorkButton = this.add.zone(400, 445, 200, 50);
    this.goToWorkButton.setInteractive({ useHandCursor: true });

    // ホバー時の色変更
    this.goToWorkButton.on('pointerover', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x888888, 1); // 明るい灰色
      buttonBg.fillRoundedRect(300, 420, 200, 50, 10);
    });

    this.goToWorkButton.on('pointerout', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x666666, 1); // 通常の灰色
      buttonBg.fillRoundedRect(300, 420, 200, 50, 10);
    });

    // クリックイベント
    this.goToWorkButton.on('pointerdown', () => {
      console.log('[MorningPhaseScene] 出勤するボタンがクリックされました');
      this.onGoToWorkButtonClicked();
    });
  }

  /**
   * 出勤するボタンがクリックされた時の処理
   */
  private onGoToWorkButtonClicked(): void {
    console.log('[MorningPhaseScene] 次の日に進みます');

    // GameControllerを経由して次の日に進む
    this.controller['gameController']['game'].advanceToNextDay();

    // GameViewを確認してゲーム終了かどうか判定
    const gameView = this.controller.view();

    if (gameView.phase === GamePhase.GAME_END) {
      // 7日目完了 → GameEndSceneへ遷移
      console.log('[MorningPhaseScene] ゲーム終了 → GameEndScene');
      this.scene.start('GameEndScene');
    } else {
      // 次の日のNightPhaseSceneへ遷移
      console.log('[MorningPhaseScene] 次の日へ → NightPhaseScene');
      this.scene.start('NightPhaseScene');
    }
  }
}
