/**
 * MorningPhaseScene - 朝フェーズ画面
 *
 * 責務:
 * - 朝の部屋を表示（操作可能）
 * - 睡眠の質と対応方法に応じたセリフ表示
 * - ドアにインタラクトで「仕事に行く」処理
 * - 締め出した場合は猫を非表示
 */

import Phaser from 'phaser';
import { GameController } from '@/application/GameController';
import { GamePhase, Direction } from '@/domain/types';
import { NightCryActionType } from '@/domain/nightcry/actions/NightCryActionType';
import { AssetKeys } from '../assets/AssetKeys';
import { InputController } from '../input/InputController';
import { PlayerCharacter } from '../characters/PlayerCharacter';
import { CatCharacter } from '../characters/CatCharacter';
import { InteractionManager } from '../interaction/InteractionManager';
import { Door } from '../interaction/objects/Door';
import {
  generateMorningMessage,
  NightCryResultForMessage,
} from '../utils/MorningMessageGenerator';
import { UIColors, UIFonts } from '../ui/UIConstants';

/**
 * MorningPhaseScene起動パラメータ
 */
export interface MorningPhaseSceneParams {
  /** 夜泣きイベントがあったかどうか */
  hadNightCryEvent: boolean;
  /** 最後に選択したアクション（イベントがあった場合） */
  lastAction?: NightCryActionType | null;
  /** どちらで完了したか（満足 or 諦め） */
  completedBy?: 'satisfaction' | 'resignation' | null;
}

/**
 * MorningPhaseScene
 */
export class MorningPhaseScene extends Phaser.Scene {
  private gameController!: GameController;
  private inputController!: InputController;
  private playerCharacter?: PlayerCharacter;
  private catCharacter?: CatCharacter;
  private interactionManager?: InteractionManager;
  private door?: Door;
  private messageContainer?: Phaser.GameObjects.Container;

  // シーンパラメータ
  private hadNightCryEvent: boolean = false;
  private lastAction?: NightCryActionType | null;
  private completedBy?: 'satisfaction' | 'resignation' | null;

  constructor() {
    super({ key: 'MorningPhaseScene' });
  }

  /**
   * シーン初期化
   */
  init(data: MorningPhaseSceneParams): void {
    console.log('[MorningPhaseScene] 初期化開始', data);

    // パラメータを保存
    this.hadNightCryEvent = data.hadNightCryEvent ?? false;
    this.lastAction = data.lastAction;
    this.completedBy = data.completedBy;

    // RegistryからgameControllerを取得
    const controller = this.registry.get('gameController');
    if (!controller) {
      throw new Error('GameController not found in registry');
    }

    this.gameController = controller;

    console.log('[MorningPhaseScene] GameController取得完了');
  }

  /**
   * シーン作成
   */
  create(): void {
    console.log('[MorningPhaseScene] シーン作成開始');

    // 物理ワールドの境界設定
    this.physics.world.setBounds(0, 0, 800, 600);

    // カメラ設定
    this.cameras.main.setBounds(0, 0, 800, 600);

    // 入力コントローラーを初期化
    this.inputController = new InputController(this);

    // 背景表示（朝の部屋）
    this.createBackground();

    // 日付表示
    this.createDayIndicator();

    // メッセージ表示
    this.createMessageDisplay();

    // プレイヤーキャラクター作成
    this.createPlayerCharacter();

    // 猫キャラクター作成（締め出していない場合のみ）
    if (this.lastAction !== NightCryActionType.LOCKED_OUT) {
      this.createCatCharacter();
    }

    // インタラクション管理を作成
    this.createInteractionManager();

    console.log('[MorningPhaseScene] シーン作成完了');
  }

  /**
   * 毎フレーム更新
   */
  update(): void {
    // 入力を取得
    const input = this.inputController.getInput();

    // インタラクト入力がある場合
    if (input?.interact && this.interactionManager) {
      this.interactionManager.interact();
    }

    // プレイヤーの移動処理
    if (input?.direction && this.playerCharacter) {
      const sprite = this.playerCharacter.getSprite();
      const speed = 3;
      let newX = sprite.x;
      let newY = sprite.y;

      // Direction から移動量を計算
      const movement = this.directionToMovement(input.direction);
      newX += movement.x * speed;
      newY += movement.y * speed;

      // 境界チェック
      newX = Math.max(50, Math.min(750, newX));
      newY = Math.max(50, Math.min(550, newY));

      // スプライト位置を直接更新
      sprite.setPosition(newX, newY);

      // インタラクション範囲判定を更新
      if (this.interactionManager) {
        this.interactionManager.update(newX, newY);
      }
    }
  }

  /**
   * Direction を移動量に変換
   */
  private directionToMovement(direction: Direction): { x: number; y: number } {
    switch (direction) {
      case Direction.UP:
        return { x: 0, y: -1 };
      case Direction.DOWN:
        return { x: 0, y: 1 };
      case Direction.LEFT:
        return { x: -1, y: 0 };
      case Direction.RIGHT:
        return { x: 1, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  }

  /**
   * 背景を作成
   */
  private createBackground(): void {
    const background = this.add.image(
      400,
      300,
      AssetKeys.Backgrounds.RoomMorning
    );
    background.setDisplaySize(800, 600);
  }

  /**
   * 日付表示を作成
   */
  private createDayIndicator(): void {
    const gameView = this.gameController.view();
    const day = gameView.day;

    const dayText = this.add.text(20, 20, `【${day}日目・朝】`, {
      fontSize: UIFonts.titleMedium,
      color: '#333333',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: { x: 10, y: 5 },
    });
  }

  /**
   * メッセージ表示を作成
   */
  private createMessageDisplay(): void {
    const result: NightCryResultForMessage = {
      hadNightCryEvent: this.hadNightCryEvent,
      lastAction: this.lastAction,
      completedBy: this.completedBy,
    };

    const message = generateMorningMessage(result);

    // メッセージコンテナを作成
    this.messageContainer = this.add.container(400, 80);

    // 背景ボックス（UIConstantsに統一）
    const bgGraphics = this.add.graphics();
    bgGraphics.fillStyle(UIColors.dialogBg, UIColors.dialogBgAlpha);
    bgGraphics.fillRoundedRect(-300, -40, 600, 80, 10);
    this.messageContainer.add(bgGraphics);

    // 睡眠の質セリフ（1行目）
    const line1 = this.add.text(0, -15, message.sleepQualityLine, {
      fontSize: UIFonts.body,
      color: `#${UIColors.textLight.toString(16).padStart(6, '0')}`,
      align: 'center',
    });
    line1.setOrigin(0.5, 0.5);
    this.messageContainer.add(line1);

    // 対応方法振り返りセリフ（2行目）
    if (message.reflectionLine) {
      const line2 = this.add.text(0, 15, message.reflectionLine, {
        fontSize: UIFonts.bodySmall,
        color: `#${UIColors.textMuted.toString(16).padStart(6, '0')}`,
        align: 'center',
      });
      line2.setOrigin(0.5, 0.5);
      this.messageContainer.add(line2);
    }
  }

  /**
   * プレイヤーキャラクターを作成
   */
  private createPlayerCharacter(): void {
    // ベッド付近に初期配置
    const initialX = 200;
    const initialY = 400;

    this.playerCharacter = new PlayerCharacter(
      this,
      initialX,
      initialY,
      AssetKeys.Player.Idle
    );
  }

  /**
   * 猫キャラクターを作成
   */
  private createCatCharacter(): void {
    // 部屋の中央付近に配置
    const catX = 500;
    const catY = 350;

    this.catCharacter = new CatCharacter(
      this,
      catX,
      catY,
      AssetKeys.Cat.Sitting
    );
  }

  /**
   * インタラクション管理を作成
   */
  private createInteractionManager(): void {
    this.interactionManager = new InteractionManager(this);

    // ドアを配置（左端）
    this.door = new Door(this, 50, 300, () => {
      this.onDoorInteract();
    });

    this.interactionManager.addObject(this.door);
  }

  /**
   * ドアインタラクト時の処理
   */
  private onDoorInteract(): void {
    console.log('[MorningPhaseScene] ドアにインタラクト: 仕事に行きます');
    this.goToWork();
  }

  /**
   * 仕事に行く処理
   */
  private goToWork(): void {
    console.log('[MorningPhaseScene] 次の日に進みます');

    // GameControllerを経由して次の日に進む
    this.gameController['game'].advanceToNextDay();

    // GameViewを確認してゲーム終了かどうか判定
    const gameView = this.gameController.view();

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
