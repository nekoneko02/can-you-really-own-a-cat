/**
 * BootScene - ゲーム起動シーン
 *
 * 責務:
 * - Reactからパラメータ受け取り（scenarioId）
 * - GameControllerの初期化
 * - アセット読み込み
 * - RoomSceneへ遷移
 */

import Phaser from 'phaser';
import { AssetLoader } from '../assets/AssetLoader';
import { GameController } from '@/application/GameController';

/**
 * ゲーム起動パラメータ（Reactから渡される）
 */
export interface GameStartParams {
  scenarioId: string;
  catName?: string;
  playerProfile?: {
    budget: number;
    freeTime: number;
    housingType: string;
  };
}

/**
 * BootScene
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  /**
   * シーン初期化
   *
   * Reactから渡されたパラメータを受け取ります。
   */
  init(data: GameStartParams): void {
    console.log('[BootScene] 初期化開始:', data);

    // GameControllerを初期化
    const gameController = new GameController({
      scenarioId: data.scenarioId,
      catName: data.catName,
    });

    // Registryに登録（他のシーンから参照可能にする）
    this.registry.set('gameController', gameController);

    console.log('[BootScene] GameController初期化完了');
  }

  /**
   * アセット読み込み
   */
  preload(): void {
    console.log('[BootScene] アセット読み込み開始');

    // ローディング表示
    this.showLoadingScreen();

    // すべてのアセットを読み込み
    AssetLoader.loadAllAssets(this);

    console.log('[BootScene] アセット読み込み完了');
  }

  /**
   * シーン作成
   */
  create(): void {
    console.log('[BootScene] シーン作成');

    // ローディング画面を非表示
    this.hideLoadingScreen();

    // 必要なシーンを追加（まだ追加されていない場合）
    if (!this.scene.manager.getScene('RoomScene')) {
      const { RoomScene } = require('./RoomScene');
      this.scene.add('RoomScene', RoomScene, false);
    }
    if (!this.scene.manager.getScene('UIScene')) {
      const { UIScene } = require('./UIScene');
      this.scene.add('UIScene', UIScene, false);
    }
    if (!this.scene.manager.getScene('NightPhaseScene')) {
      const { NightPhaseScene } = require('./NightPhaseScene');
      this.scene.add('NightPhaseScene', NightPhaseScene, false);
    }
    if (!this.scene.manager.getScene('MorningPhaseScene')) {
      const { MorningPhaseScene } = require('./MorningPhaseScene');
      this.scene.add('MorningPhaseScene', MorningPhaseScene, false);
    }
    if (!this.scene.manager.getScene('GameEndScene')) {
      const { GameEndScene } = require('./GameEndScene');
      this.scene.add('GameEndScene', GameEndScene, false);
    }

    // NightPhaseSceneから開始（1日の始まり）
    this.scene.start('NightPhaseScene');

    console.log('[BootScene] RoomSceneへ遷移');
  }

  /**
   * ローディング画面を表示
   */
  private showLoadingScreen(): void {
    const { width, height } = this.cameras.main;

    // 背景
    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 1);
    bg.fillRect(0, 0, width, height);

    // ローディングテキスト
    const loadingText = this.add.text(width / 2, height / 2, 'Loading...', {
      fontSize: '32px',
      color: '#ffffff',
    });
    loadingText.setOrigin(0.5, 0.5);

    // プログレスバー
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 + 50, 320, 50);

    // ローディング進行
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 + 60, 300 * value, 30);
    });

    // 完了時にクリア
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();

      // アニメーション生成
      AssetLoader.createAnimations(this);
    });
  }

  /**
   * ローディング画面を非表示
   */
  private hideLoadingScreen(): void {
    // create()で自動的にクリアされるため、特に処理なし
  }
}
