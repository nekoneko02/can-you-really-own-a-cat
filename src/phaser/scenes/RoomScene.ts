/**
 * RoomScene - メインゲーム画面
 *
 * 責務:
 * - 部屋の背景描画
 * - プレイヤー・猫キャラクターの表示
 * - GameControllerとの連携（tick/view）
 * - インタラクティブオブジェクトの配置
 */

import Phaser from 'phaser';
import { PhaserGameController } from '../controllers/PhaserGameController';
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
import { MorningMessageUI } from '../ui/MorningMessageUI';

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
  private controller!: PhaserGameController;
  private inputController!: InputController;
  private background!: Phaser.GameObjects.Image;
  private playerCharacter?: PlayerCharacter;
  private catCharacter?: CatCharacter;
  private interactionManager?: InteractionManager;
  private emotionInputUI?: EmotionInputUI;
  private morningMessageUI?: MorningMessageUI;
  private hasEvent: boolean = false;

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

    // Registryからcontrollerを取得
    const gameController = this.registry.get('gameController');
    if (!gameController) {
      throw new Error('GameController not found in registry');
    }

    this.controller = new PhaserGameController(gameController);

    console.log('[RoomScene] GameController取得完了');
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

    // EmotionInputUIとMorningMessageUIを作成
    this.emotionInputUI = new EmotionInputUI(this);
    this.morningMessageUI = new MorningMessageUI(this);

    // UISceneを起動（重ね合わせ）
    this.scene.launch('UIScene');

    console.log('[RoomScene] シーン作成完了');
  }

  /**
   * 毎フレーム更新
   */
  update(time: number, delta: number): void {
    // 入力を取得
    const input = this.inputController.getInput();

    // インタラクト入力がある場合
    if (input?.interact && this.interactionManager) {
      this.interactionManager.interact();
    }

    // GameControllerに入力を送信（入力がない場合も空のオブジェクトを送る）
    // これにより、ユーザーが移動しなくてもイベントトリガーが毎フレーム判定される
    this.controller.tick(input || {});

    // GameControllerから最新状態を取得
    const gameView = this.controller.view();

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

    // フェーズに応じた背景変更
    this.updateBackground(gameView.phase);

    // 気持ち入力待ちの場合、EmotionInputUIを表示
    if (gameView.isWaitingForEmotionInput && this.emotionInputUI) {
      this.showEmotionInput(gameView);
    }

    // フェーズ遷移判定
    this.checkPhaseTransition(gameView.phase);
  }

  /**
   * フェーズ遷移をチェック
   */
  private checkPhaseTransition(phase: GamePhase): void {
    if (phase === GamePhase.MORNING_OUTRO) {
      // 朝フェーズに遷移
      console.log('[RoomScene] 朝フェーズに遷移します');
      this.scene.start('MorningPhaseScene');
    } else if (phase === GamePhase.GAME_END) {
      // ゲーム終了
      console.log('[RoomScene] ゲーム終了画面に遷移します');
      this.scene.start('GameEndScene');
    }
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
    // GameViewから初期位置を取得
    const gameView = this.controller.view();

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
    // GameViewから初期位置を取得
    const gameView = this.controller.view();

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

      // GameControllerに気持ちを記録
      this.controller['gameController'].recordEmotion(emotion);

      // すぐに朝フェーズに遷移（イベント再発火を防ぐため）
      this.controller['gameController']['game'].transitionToMorning();

      // 翌朝メッセージを表示
      this.showMorningMessage(gameView);
    });
  }

  /**
   * 翌朝メッセージを表示
   */
  private showMorningMessage(gameView: any): void {
    if (!this.morningMessageUI) return;

    const message = this.generateMorningMessage(gameView);

    this.morningMessageUI.show(message, () => {
      console.log('[RoomScene] 朝メッセージを閉じました');
      // フェーズ遷移は既にshowEmotionInput()で実行済み
    });
  }

  /**
   * 翌朝メッセージを生成
   */
  private generateMorningMessage(gameView: any): string {
    const nextDay = gameView.day + 1;

    // 暫定: 固定メッセージ
    return `【${nextDay}日目・朝 7:00】

目覚ましが鳴ります。

時計を見ると、7時です。
あなたは昨夜、結局4時間しか眠れませんでした。

今日は朝9時から予定があります。`;
  }
}
