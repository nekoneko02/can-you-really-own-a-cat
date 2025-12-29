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
import { GameApplicationService } from '@/application/GameApplicationService';
import { EventUIManager } from '../ui/EventUIManager';
import { ProgressIndicator } from '../ui/ProgressIndicator';

/**
 * UIScene
 */
export class UIScene extends Phaser.Scene {
  private appService!: GameApplicationService;
  private progressIndicator?: ProgressIndicator;
  private eventUIManager?: EventUIManager;

  constructor() {
    super({ key: 'UIScene' });
  }

  /**
   * シーン初期化
   */
  init(): void {
    console.log('[UIScene] 初期化開始');

    // RegistryからappServiceを取得
    const appService = this.registry.get('appService');
    if (!appService) {
      throw new Error('GameApplicationService not found in registry');
    }

    this.appService = appService;

    console.log('[UIScene] GameApplicationService取得完了');
  }

  /**
   * シーン作成
   */
  create(): void {
    console.log('[UIScene] シーン作成開始');

    // 進行状況表示（左上）
    this.progressIndicator = new ProgressIndicator(this, 20, 20);

    // イベントUIマネージャー（中央下）
    this.eventUIManager = new EventUIManager(this, this.appService);

    console.log('[UIScene] シーン作成完了');
  }

  /**
   * 毎フレーム更新
   */
  update(): void {
    // GameApplicationServiceから最新状態を取得
    const gameView = this.appService.getView();

    // 進行状況を更新
    this.progressIndicator?.update(gameView.day, gameView.time, gameView.phase);

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
