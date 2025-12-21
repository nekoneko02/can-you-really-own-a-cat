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
import { BaseButton } from '@/phaser/ui/components/BaseButton';

/**
 * NightPhaseScene
 */
export class NightPhaseScene extends Phaser.Scene {
  private sleepButton?: BaseButton;
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
    this.sleepButton = new BaseButton(
      this,
      400,
      425,
      '寝る',
      () => {
        console.log('[NightPhaseScene] 寝るボタンがクリックされました');
        this.onSleepButtonClicked();
      },
      { size: 'primary' }
    );
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

    // SleepingSceneへ遷移（イベント情報を渡す）
    this.scene.start('SleepingScene', {
      hasEvent: eventId !== null,
      eventId: eventId,
    });
  }
}
