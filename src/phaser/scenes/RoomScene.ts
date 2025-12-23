/**
 * RoomScene - メインゲーム画面
 *
 * 責務:
 * - 部屋の背景描画
 * - プレイヤー・猫キャラクターの表示
 * - GameApplicationService への委譲（入力処理、イベント処理）
 * - インタラクティブオブジェクトの配置
 *
 * 注: DDDに基づき、ドメインクラスを直接操作せず、Application層に委譲する
 */

import Phaser from 'phaser';
import { AssetKeys } from '../assets/AssetKeys';
import { GamePhase } from '@/domain/types';
import { InputController } from '../input/InputController';
import { PlayerCharacter } from '../characters/PlayerCharacter';
import { CatCharacter } from '../characters/CatCharacter';
import { InteractionManager } from '../interaction/InteractionManager';
import { Bed } from '../interaction/objects/Bed';
import { FoodBowl } from '../interaction/objects/FoodBowl';
import { Toy } from '../interaction/objects/Toy';
import { EmotionInputUI } from '../ui/EmotionInputUI';
import { CollisionDetector } from '../collision/CollisionDetector';
import { MorningPhaseSceneParams } from './MorningPhaseScene';
import { NightCryUIManager } from '../ui/NightCryUIManager';
import { NightCryActionType } from '@/domain/nightcry/actions/NightCryActionType';
import { GameApplicationService } from '@/application/GameApplicationService';

/**
 * RoomScene起動パラメータ
 */
export interface RoomSceneParams {
  hasEvent: boolean;
  eventId: string | null;
}

/**
 * RoomScene
 */
export class RoomScene extends Phaser.Scene {
  private appService!: GameApplicationService;
  private inputController!: InputController;
  private background!: Phaser.GameObjects.Image;
  private playerCharacter?: PlayerCharacter;
  private catCharacter?: CatCharacter;
  private interactionManager?: InteractionManager;
  private emotionInputUI?: EmotionInputUI;
  private hasEvent: boolean = false;
  private lastNightCryAction?: NightCryActionType | null;
  private lastCompletedBy?: 'satisfaction' | 'resignation' | null;
  private collisionDetector!: CollisionDetector;
  private nightCryUIManager!: NightCryUIManager;
  private lastLoggedTime: number = 0;

  constructor() {
    super({ key: 'RoomScene' });
  }

  /**
   * シーン初期化
   */
  init(data: RoomSceneParams): void {
    console.log('[RoomScene] 初期化開始', data);

    // イベントの有無を記録
    this.hasEvent = data.hasEvent ?? false;

    // Registryから catName を取得（存在する場合）
    const catName = this.registry.get('catName');

    // GameApplicationService を初期化
    this.appService = new GameApplicationService({
      scenarioId: 'test',
      catName: catName || undefined,
    });

    // イベントがある場合はMIDNIGHT_EVENTフェーズに設定
    // （NightPhaseSceneからの遷移時、フェーズがNIGHT_PREPになっているため）
    if (this.hasEvent) {
      console.log('[RoomScene] イベントあり。MIDNIGHT_EVENTフェーズに設定');
      this.appService.getGame().transitionToMidnight();
    }

    console.log('[RoomScene] GameApplicationService 初期化完了');
  }

  /**
   * シーン作成
   */
  create(): void {
    console.log('[RoomScene] シーン作成開始');

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

    // 猫キャラクター作成
    this.createCatCharacter();

    // インタラクション管理を作成
    this.createInteractionManager();

    // EmotionInputUIを作成
    this.emotionInputUI = new EmotionInputUI(this);

    // CollisionDetector と NightCryUIManager を初期化
    this.collisionDetector = new CollisionDetector();
    this.nightCryUIManager = new NightCryUIManager(this);

    // UISceneを起動（重ね合わせ）
    this.scene.launch('UIScene');

    console.log('[RoomScene] シーン作成完了');
  }

  /**
   * 毎フレーム更新
   */
  update(time: number, delta: number): void {
    // 入力を取得
    let input = this.inputController.getInput();

    // 夜泣きイベント中の入力制御
    const nightCryState = this.appService.getNightCryEventState();
    if (nightCryState.isActive &&
        nightCryState.currentAction !== null &&
        nightCryState.currentAction !== NightCryActionType.CATCHING) {
      // 移動入力を無効化（interactは許可）
      if (input) {
        input = { interact: input.interact };
      }
    }

    // インタラクト入力がある場合
    if (input?.interact && this.interactionManager) {
      this.interactionManager.interact();
    }

    // GameApplicationService に更新を委譲
    this.appService.update(input || {}, delta);

    // ビューを取得
    const gameView = this.appService.getView();

    // プレイヤーキャラクターを更新
    if (this.playerCharacter) {
      this.playerCharacter.update(gameView.player);
    }

    // 猫キャラクターを更新
    if (this.catCharacter) {
      this.catCharacter.update(gameView.cat);
    }

    // インタラクション範囲判定を更新
    if (this.interactionManager) {
      this.interactionManager.update(gameView.player.x, gameView.player.y);
    }

    // 夜泣きイベントUI処理
    this.updateNightCryEventUI(gameView, nightCryState);

    // フェーズに応じた背景変更
    this.updateBackground(gameView.phase);

    // 気持ち入力待ちの場合、EmotionInputUIを表示
    if (gameView.isWaitingForEmotionInput && this.emotionInputUI) {
      this.showEmotionInput(gameView);
    }

    // フェーズ遷移判定
    const transition = this.appService.checkPhaseTransition();
    if (transition.shouldTransition && transition.nextScene) {
      console.log(`[RoomScene] ${transition.nextScene} に遷移します`);

      if (transition.nextScene === 'MorningPhaseScene') {
        // MorningPhaseScene へ遷移する際に、夜泣きイベント結果を渡す
        const params: MorningPhaseSceneParams = {
          hadNightCryEvent: this.hasEvent,
          lastAction: this.lastNightCryAction,
          completedBy: this.lastCompletedBy,
        };
        this.scene.start(transition.nextScene, params);
      } else {
        this.scene.start(transition.nextScene);
      }
    }
  }

  /**
   * 夜泣きイベントUI更新
   */
  private updateNightCryEventUI(gameView: any, nightCryState: any): void {
    if (nightCryState.isActive) {
      // デバッグログ（毎秒）
      const currentTime = this.appService.getTimeService().getElapsedMs();
      if (Math.floor(currentTime / 1000) !== Math.floor(this.lastLoggedTime / 1000)) {
        console.log(`[RoomScene] 夜泣きイベント: 満足度=${nightCryState.satisfaction.toFixed(2)}, 諦め度=${nightCryState.resignation.toFixed(2)}`);
        this.lastLoggedTime = currentTime;
      }

      // イベント完了直前に結果を保存（MorningPhaseScene へ渡すため）
      if (nightCryState.isCompleted) {
        this.saveNightCryResult(nightCryState);
      }

      // 猫を捕まえる処理（衝突判定）
      this.handleCatching(gameView, nightCryState);

      // UIを更新
      if (!this.nightCryUIManager.isShown()) {
        const availableActions = this.appService.getAvailableNightCryActions();
        this.nightCryUIManager.showWithState(
          nightCryState,
          (actionType) => {
            this.handleNightCryActionSelected(actionType);
          },
          availableActions
        );
      }
    } else {
      // イベントが非アクティブならUIを非表示
      if (this.nightCryUIManager.isShown()) {
        this.nightCryUIManager.hide();
      }
    }
  }

  /**
   * 夜泣きイベント結果を保存
   */
  private saveNightCryResult(nightCryState: any): void {
    this.lastNightCryAction = nightCryState.currentAction;

    if (nightCryState.satisfaction >= 1.0) {
      this.lastCompletedBy = 'satisfaction';
    } else if (nightCryState.resignation >= 1.0) {
      this.lastCompletedBy = 'resignation';
    }

    console.log(`[RoomScene] 夜泣きイベント結果保存: action=${this.lastNightCryAction}, completedBy=${this.lastCompletedBy}`);
  }

  /**
   * 背景を作成
   */
  private createBackground(): void {
    // 初期背景（夜）
    this.background = this.add.image(400, 300, AssetKeys.Backgrounds.RoomNight);
    this.background.setDisplaySize(800, 600);
  }

  /**
   * フェーズに応じて背景を変更
   */
  private updateBackground(phase: GamePhase): void {
    let backgroundKey: string;

    switch (phase) {
      case GamePhase.NIGHT_PREP:
        backgroundKey = AssetKeys.Backgrounds.RoomNight;
        break;
      case GamePhase.MIDNIGHT_EVENT:
        backgroundKey = AssetKeys.Backgrounds.RoomMidnight;
        break;
      case GamePhase.MORNING_OUTRO:
        backgroundKey = AssetKeys.Backgrounds.RoomMorning;
        break;
      default:
        backgroundKey = AssetKeys.Backgrounds.RoomNight;
    }

    // 背景が変わった場合のみテクスチャ変更
    if (this.background.texture.key !== backgroundKey) {
      this.background.setTexture(backgroundKey);
    }
  }

  /**
   * プレイヤーキャラクターを作成
   */
  private createPlayerCharacter(): void {
    const gameView = this.appService.getView();

    this.playerCharacter = new PlayerCharacter(
      this,
      gameView.player.x,
      gameView.player.y,
      AssetKeys.Player.Idle
    );
  }

  /**
   * 猫キャラクターを作成
   */
  private createCatCharacter(): void {
    const gameView = this.appService.getView();

    this.catCharacter = new CatCharacter(
      this,
      gameView.cat.x,
      gameView.cat.y,
      AssetKeys.Cat.Sitting
    );
  }

  /**
   * インタラクション管理を作成
   */
  private createInteractionManager(): void {
    this.interactionManager = new InteractionManager(this);

    // インタラクト可能なオブジェクトを配置
    const bed = new Bed(this, 100, 500);
    const foodBowl = new FoodBowl(this, 700, 500);
    const toy = new Toy(this, 400, 400);

    this.interactionManager.addObject(bed);
    this.interactionManager.addObject(foodBowl);
    this.interactionManager.addObject(toy);
  }

  /**
   * 気持ち入力UIを表示
   */
  private showEmotionInput(gameView: any): void {
    if (!this.emotionInputUI) return;

    // 一度だけ表示（複数回呼ばれるのを防ぐ）
    if (this.emotionInputUI['container'].visible) return;

    this.emotionInputUI.show((emotion) => {
      console.log('[RoomScene] 気持ちを記録します:', emotion);
      // 朝メッセージは MorningPhaseScene で表示するため、ここでは何もしない
    });
  }

  /**
   * 夜泣きアクション選択時の処理
   */
  private handleNightCryActionSelected(actionType: NightCryActionType): void {
    console.log(`[RoomScene] 夜泣きアクション選択: ${actionType}`);

    // GameApplicationService にアクション選択を委譲
    this.appService.selectNightCryAction(actionType);

    // UIを再表示
    this.nightCryUIManager.hide();
    const nightCryState = this.appService.getNightCryEventState();
    const availableActions = this.appService.getAvailableNightCryActions();
    this.nightCryUIManager.showWithState(
      nightCryState,
      (nextActionType) => {
        this.handleNightCryActionSelected(nextActionType);
      },
      availableActions
    );
  }

  /**
   * 猫を捕まえる処理
   */
  private handleCatching(gameView: any, nightCryState: any): void {
    const currentAction = nightCryState.currentAction;

    // プレイヤーと猫の距離を確認
    const isColliding = this.collisionDetector.isColliding(
      gameView.player.x,
      gameView.player.y,
      gameView.cat.x,
      gameView.cat.y
    );

    // CATCHINGアクション中に猫を捕まえたら、LOCKED_OUTアクションに移行
    if (isColliding && currentAction === NightCryActionType.CATCHING) {
      console.log('[RoomScene] 猫を捕まえました！別の部屋に追い出します。');
      this.appService.selectNightCryAction(NightCryActionType.LOCKED_OUT);

      // UIを再表示
      this.nightCryUIManager.hide();
      const updatedState = this.appService.getNightCryEventState();
      const availableActions = this.appService.getAvailableNightCryActions();
      this.nightCryUIManager.showWithState(
        updatedState,
        (actionType) => {
          this.handleNightCryActionSelected(actionType);
        },
        availableActions
      );
    }
  }
}
