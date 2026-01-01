/**
 * SleepingScene - 睡眠中シーン
 *
 * 責務:
 * - 就寝後の睡眠中の様子を表現
 * - イベント有無にかかわらず、自然な遷移を提供
 * - フェードイン/フェードアウト効果
 */

import Phaser from 'phaser';
import { GameController } from '@/application/GameController';
import { MorningPhaseSceneParams } from './MorningPhaseScene';

/**
 * SleepingScene起動パラメータ
 */
export interface SleepingSceneParams {
  hasEvent: boolean;
  eventId: string | null;
}

/**
 * SleepingScene
 */
export class SleepingScene extends Phaser.Scene {
  private gameController!: GameController;
  private hasEvent: boolean = false;
  private eventId: string | null = null;

  // 睡眠中シーンの表示時間（ミリ秒）
  private readonly SLEEP_DURATION = 2500;

  constructor() {
    super({ key: 'SleepingScene' });
  }

  /**
   * シーン初期化
   */
  init(data: SleepingSceneParams): void {
    console.log('[SleepingScene] 初期化開始', data);

    // イベント情報を記録
    this.hasEvent = data.hasEvent ?? false;
    this.eventId = data.eventId ?? null;

    // RegistryからgameControllerを取得
    const controller = this.registry.get('gameController');
    if (!controller) {
      throw new Error('GameController not found in registry');
    }

    this.gameController = controller;

    console.log('[SleepingScene] GameController取得完了');
  }

  /**
   * シーン作成
   */
  create(): void {
    console.log('[SleepingScene] シーン作成開始');

    // 背景（睡眠中を表現する暗い背景）
    this.createBackground();

    // テキスト表示
    this.createText();

    // フェードイン効果で開始
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // 一定時間後に次のシーンへ遷移
    this.time.delayedCall(this.SLEEP_DURATION, () => {
      this.transitionToNextScene();
    });

    console.log('[SleepingScene] シーン作成完了');
  }

  /**
   * 背景を作成
   */
  private createBackground(): void {
    const bg = this.add.graphics();
    bg.fillStyle(0x0a0a1a, 1); // 非常に暗い青
    bg.fillRect(0, 0, 800, 600);

    // 星を表示（睡眠中を表現）
    this.createStars();
  }

  /**
   * 星を表示
   */
  private createStars(): void {
    const stars = this.add.graphics();
    stars.fillStyle(0xffffff, 0.8);

    // ランダムに星を配置
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(0, 800);
      const y = Phaser.Math.Between(0, 600);
      const radius = Phaser.Math.Between(1, 2);
      stars.fillCircle(x, y, radius);
    }
  }

  /**
   * テキストを表示
   */
  private createText(): void {
    const text = this.add.text(400, 300, 'Zzz...', {
      fontSize: '48px',
      color: '#ffffff',
      fontStyle: 'italic',
    });
    text.setOrigin(0.5, 0.5);
    text.setAlpha(0.5);

    // Zzz... のフェードアニメーション
    this.tweens.add({
      targets: text,
      alpha: { from: 0.3, to: 0.7 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });
  }

  /**
   * 次のシーンへ遷移
   */
  private transitionToNextScene(): void {
    console.log('[SleepingScene] 次のシーンへ遷移します。hasEvent:', this.hasEvent);

    // フェードアウト効果
    this.cameras.main.fadeOut(500, 0, 0, 0);

    // フェードアウト完了後にシーン遷移
    this.cameras.main.once('camerafadeoutcomplete', () => {
      if (this.hasEvent) {
        // イベントがある場合: 夜泣きシナリオのフェーズ1へ
        console.log('[SleepingScene] イベントあり。NightcryPhase1Sceneへ遷移');
        this.scene.start('NightcryPhase1Scene');
      } else {
        // イベントがない場合: MorningPhaseSceneへ
        console.log('[SleepingScene] イベントなし。MorningPhaseSceneへ遷移');
        const params: MorningPhaseSceneParams = {
          hadNightCryEvent: false,
        };
        this.scene.start('MorningPhaseScene', params);
      }
    });
  }
}
