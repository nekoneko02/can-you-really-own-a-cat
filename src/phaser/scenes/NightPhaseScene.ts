/**
 * NightPhaseScene - 夜フェーズ画面（改善版）
 *
 * 責務:
 * - 1日の終わりを設定し、就寝へ誘導
 * - RoomSceneと同じ間取り（room_night背景）
 * - プレイヤー移動、ベッドへのインタラクション
 * - 猫は固定表示（眠そうな姿勢）
 */

import Phaser from 'phaser';
import { AssetKeys } from '../assets/AssetKeys';
import { GameController } from '@/application/GameController';
import { GamePhase } from '@/domain/types';
import { InputController } from '../input/InputController';
import { PlayerCharacter } from '../characters/PlayerCharacter';
import { CatCharacter } from '../characters/CatCharacter';
import { InteractionManager } from '../interaction/InteractionManager';
import { Bed } from '../interaction/objects/Bed';
import { DialogSystem } from '../ui/DialogSystem';
import { ProgressIndicator } from '../ui/ProgressIndicator';

/**
 * 寝る機能付きベッドクラス
 */
class NightBed extends Bed {
  private onInteractCallback: () => void;

  constructor(scene: Phaser.Scene, x: number, y: number, onInteract: () => void) {
    super(scene, x, y);
    this.onInteractCallback = onInteract;
  }

  interact(): void {
    console.log('[NightBed] インタラクト実行');
    this.onInteractCallback();
  }
}

/**
 * NightPhaseScene
 */
export class NightPhaseScene extends Phaser.Scene {
  private gameController!: GameController;
  private inputController!: InputController;
  private background!: Phaser.GameObjects.Image;
  private playerCharacter?: PlayerCharacter;
  private catCharacter?: CatCharacter;
  private interactionManager?: InteractionManager;
  private dialogSystem?: DialogSystem;
  private progressIndicator?: ProgressIndicator;

  // プレイヤー初期位置
  private readonly PLAYER_INITIAL_X = 300;
  private readonly PLAYER_INITIAL_Y = 350;

  // 猫位置（固定）
  private readonly CAT_X = 500;
  private readonly CAT_Y = 400;

  // ベッド位置
  private readonly BED_X = 100;
  private readonly BED_Y = 500;

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

    // 物理ワールドの境界設定
    this.physics.world.setBounds(0, 0, 800, 600);

    // カメラ設定
    this.cameras.main.setBounds(0, 0, 800, 600);

    // 入力コントローラーを初期化
    this.inputController = new InputController(this);

    // 背景表示
    this.createBackground();

    // プレイヤーキャラクター作成
    this.createPlayerCharacter();

    // 猫キャラクター作成（固定表示）
    this.createCatCharacter();

    // インタラクション管理を作成
    this.createInteractionManager();

    // ダイアログを作成・表示
    this.createDialog();

    // 進行状況インジケーターを作成
    this.createProgressIndicator();

    console.log('[NightPhaseScene] シーン作成完了');
  }

  /**
   * 毎フレーム更新
   */
  update(time: number, delta: number): void {
    // 入力を取得
    const input = this.inputController.getInput();

    // 入力がある場合、GameControllerに委譲
    if (input) {
      // インタラクト入力がある場合
      if (input.interact && this.interactionManager) {
        this.interactionManager.interact();
      }

      // 移動入力がある場合
      if (input.direction) {
        this.gameController.tick(input);
      }
    }

    // ビューを取得
    const gameView = this.gameController.view();

    // プレイヤーキャラクターを更新
    if (this.playerCharacter) {
      this.playerCharacter.update(gameView.player);
    }

    // 猫は固定表示なので更新しない

    // インタラクション範囲判定を更新
    if (this.interactionManager) {
      this.interactionManager.update(gameView.player.x, gameView.player.y);
    }

    // 進行状況を更新
    if (this.progressIndicator) {
      this.progressIndicator.update(gameView.day, 2200, GamePhase.NIGHT_PREP);
    }
  }

  /**
   * 背景を作成
   */
  private createBackground(): void {
    this.background = this.add.image(400, 300, AssetKeys.Backgrounds.RoomNight);
    this.background.setDisplaySize(800, 600);
  }

  /**
   * プレイヤーキャラクターを作成
   */
  private createPlayerCharacter(): void {
    // プレイヤーを初期位置に配置
    this.playerCharacter = new PlayerCharacter(
      this,
      this.PLAYER_INITIAL_X,
      this.PLAYER_INITIAL_Y,
      AssetKeys.Player.Idle
    );

    // GameControllerのプレイヤー位置を初期化
    const player = this.gameController['game']['player'];
    player.x = this.PLAYER_INITIAL_X;
    player.y = this.PLAYER_INITIAL_Y;
  }

  /**
   * 猫キャラクターを作成（固定表示・眠そうな姿勢）
   */
  private createCatCharacter(): void {
    // 眠そうな猫（Sleepingアニメーション）を固定位置に配置
    this.catCharacter = new CatCharacter(
      this,
      this.CAT_X,
      this.CAT_Y,
      AssetKeys.Cat.Sleeping
    );
  }

  /**
   * インタラクション管理を作成
   */
  private createInteractionManager(): void {
    this.interactionManager = new InteractionManager(this);

    // ベッドを配置（インタラクト時のコールバックを設定）
    const bed = new NightBed(this, this.BED_X, this.BED_Y, () => {
      this.onBedInteract();
    });

    this.interactionManager.addObject(bed);
  }

  /**
   * ダイアログを作成・表示
   */
  private createDialog(): void {
    this.dialogSystem = new DialogSystem(this);

    // レガシー方式でテキスト表示（送り操作なし、常時表示）
    this.dialogSystem.show(
      '',
      '今日も疲れた。そろそろ寝よう。',
      ['🐱 たまも眠そうにしている。']
    );
  }

  /**
   * 進行状況インジケーターを作成
   */
  private createProgressIndicator(): void {
    this.progressIndicator = new ProgressIndicator(this, 20, 20);
    const gameView = this.gameController.view();
    this.progressIndicator.update(gameView.day, 2200, GamePhase.NIGHT_PREP);
  }

  /**
   * ベッドにインタラクトした時の処理
   */
  private onBedInteract(): void {
    console.log('[NightPhaseScene] ベッドにインタラクト - 寝る処理を開始');

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
