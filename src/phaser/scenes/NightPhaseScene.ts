/**
 * NightPhaseScene - 夜フェーズ画面
 *
 * 責務:
 * - 1日の終わりを設定し、就寝へ誘導
 * - テキスト表示「今日も疲れた。寝よう」
 * - 「寝る」ボタンでRoomSceneへ遷移
 */

import Phaser from 'phaser';
import { AssetKeys } from '../assets/AssetKeys';
import { GameController } from '@/application/GameController';

/**
 * NightPhaseScene
 */
export class NightPhaseScene extends Phaser.Scene {
  private sleepButton?: Phaser.GameObjects.Zone;
  private gameController!: GameController;

  constructor() {
    super({ key: 'NightPhaseScene' });
  }

  /**
   * シーン初期化
   */
  init(): void {
    console.log('[NightPhaseScene] 初期化開始');

    // RegistryからgameControllerを取得
    const controller = this.registry.get('gameController');
    if (!controller) {
      throw new Error('GameController not found in registry');
    }

    this.gameController = controller;

    console.log('[NightPhaseScene] GameController取得完了');
  }

  /**
   * シーン作成
   */
  create(): void {
    console.log('[NightPhaseScene] シーン作成開始');

    // 背景（プレースホルダー: 濃紺）
    this.createBackground();

    // テキスト表示
    this.createText();

    // 「寝る」ボタン
    this.createSleepButton();

    console.log('[NightPhaseScene] シーン作成完了');
  }

  /**
   * 背景を作成（プレースホルダー）
   */
  private createBackground(): void {
    const bg = this.add.graphics();
    bg.fillStyle(0x1a1a3e, 1); // 濃紺
    bg.fillRect(0, 0, 800, 600);
  }

  /**
   * テキストを表示
   */
  private createText(): void {
    const text = this.add.text(400, 200, '今日も疲れた。\nそろそろ寝よう。', {
      fontSize: '24px',
      color: '#ffffff',
      align: 'center',
    });
    text.setOrigin(0.5, 0.5);

    // 猫の様子を表示
    const catText = this.add.text(
      400,
      300,
      'たまも眠そうにしている。',
      {
        fontSize: '18px',
        color: '#cccccc',
        align: 'center',
      }
    );
    catText.setOrigin(0.5, 0.5);
  }

  /**
   * 「寝る」ボタンを作成
   */
  private createSleepButton(): void {
    // ボタン背景（Graphics）
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(0x666666, 1);
    buttonBg.fillRoundedRect(300, 400, 200, 50, 10);

    // ボタンテキスト
    const buttonText = this.add.text(400, 425, '寝る', {
      fontSize: '24px',
      color: '#ffffff',
    });
    buttonText.setOrigin(0.5, 0.5);

    // インタラクティブゾーン
    this.sleepButton = this.add.zone(400, 425, 200, 50);
    this.sleepButton.setInteractive({ useHandCursor: true });

    // ホバー時の色変更
    this.sleepButton.on('pointerover', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x888888, 1); // 明るい灰色
      buttonBg.fillRoundedRect(300, 400, 200, 50, 10);
    });

    this.sleepButton.on('pointerout', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x666666, 1); // 通常の灰色
      buttonBg.fillRoundedRect(300, 400, 200, 50, 10);
    });

    // クリックイベント
    this.sleepButton.on('pointerdown', () => {
      console.log('[NightPhaseScene] 寝るボタンがクリックされました');
      this.onSleepButtonClicked();
    });
  }

  /**
   * 寝るボタンがクリックされた時の処理
   */
  private onSleepButtonClicked(): void {
    console.log('[NightPhaseScene] フェーズを夜中に移行します');

    // GameControllerを経由してフェーズを夜中に移行
    this.gameController['game'].transitionToMidnight();

    // 現在の日を取得
    const currentDay = this.gameController['game'].getCurrentDay();

    // EventSchedulerから今日のイベントIDを取得
    const eventScheduler = this.gameController['game']['eventScheduler'];
    const eventId = eventScheduler.getEventIdForDay(currentDay);

    console.log('[NightPhaseScene] Day', currentDay, 'のイベント:', eventId ?? 'なし');

    // RoomScene（夜中フェーズ）へ遷移（イベント情報を渡す）
    this.scene.start('RoomScene', {
      hasEvent: eventId !== null,
      eventId: eventId,
    });
  }
}
