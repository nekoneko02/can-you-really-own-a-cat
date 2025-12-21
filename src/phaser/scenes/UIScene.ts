/**
 * UIScene - UI重ね合わせシーン
 *
 * 責務:
 * - RoomSceneの上に重ね合わせてUI要素を表示
 * - イベントテキスト表示エリア（将来実装）
 * - 選択肢ボタン（将来実装）
 * - ステータスバー（将来実装）
 * - 進行状況表示（Day, 時刻）
 */

import Phaser from 'phaser';
import { PhaserGameController } from '../controllers/PhaserGameController';
import { EventUIManager } from '../ui/EventUIManager';
import { StatusDisplay } from '../ui/StatusDisplay';
import { ProgressIndicator } from '../ui/ProgressIndicator';

/**
 * UIScene
 */
export class UIScene extends Phaser.Scene {
  private controller!: PhaserGameController;
  private progressIndicator?: ProgressIndicator;
  private statusDisplay?: StatusDisplay;
  private eventUIManager?: EventUIManager;

  constructor() {
    super({ key: 'UIScene' });
  }

  /**
   * シーン初期化
   */
  init(): void {
    console.log('[UIScene] 初期化開始');

    // Registryからcontrollerを取得
    const gameController = this.registry.get('gameController');
    if (!gameController) {
      throw new Error('GameController not found in registry');
    }

    this.controller = new PhaserGameController(gameController);

    console.log('[UIScene] GameController取得完了');
  }

  /**
   * シーン作成
   */
  create(): void {
    console.log('[UIScene] シーン作成開始');

    // 進行状況表示（左上）
    this.progressIndicator = new ProgressIndicator(this, 20, 20);

    // ステータスバー表示（右上）
    this.statusDisplay = new StatusDisplay(this, 600, 20);

    // イベントUIマネージャー（中央下）
    this.eventUIManager = new EventUIManager(this, this.controller);

    console.log('[UIScene] シーン作成完了');
  }

  /**
   * 毎フレーム更新
   */
  update(): void {
    // GameControllerから最新状態を取得
    const gameView = this.controller.view();

    // 進行状況を更新
    this.progressIndicator?.update(gameView.day, gameView.time, gameView.phase);

    // ステータスバーを更新（猫の名前も渡す）
    this.statusDisplay?.update(gameView.catStatus, gameView.cat.name);

    // 気持ち入力待ち状態の場合はEventUIを非表示
    if (gameView.isWaitingForEmotionInput) {
      this.eventUIManager?.update(null, null);
    } else {
      // 夜泣きイベントはRoomSceneのNightCryUIManagerで処理するため、ここでは除外
      if (gameView.currentEvent && gameView.currentEvent.id.includes('night_crying')) {
        this.eventUIManager?.update(null, null);
      } else {
        // イベントUIを更新（currentEventとcurrentScenarioStepの両方を渡す）
        this.eventUIManager?.update(gameView.currentEvent, gameView.currentScenarioStep);
      }
    }
  }
}
