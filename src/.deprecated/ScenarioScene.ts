'use client';

import * as Phaser from 'phaser';
import { Cat } from '@/domain/cat';
import { Choice, Event, GameSession, Scenario } from '@/domain/game';
import { AssetLoader } from '@/lib/AssetLoader';
import { logDebug, logError, logInfo } from '@/lib/log';

export interface ScenarioSceneData {
  cat?: Cat;
  scenario?: Scenario;
  session?: GameSession;
  onGameEnd?: () => Promise<void>;
  onEventComplete?: (eventIndex: number) => Promise<void>;
}

/**
 * ビジュアルノベル型のシナリオScene
 *
 * 設計原則:
 * - ステートレス: init(data) で状態を受け取り、内部状態は持たない
 * - イベント駆動: ユーザーの選択時のみ状態更新
 * - シンプルなUI: テキスト表示 + 選択肢ボタン
 */
export default class ScenarioScene extends Phaser.Scene {
  // ゲームデータ（init で受け取る）
  private cat!: Cat;
  private scenario!: Scenario;
  private session!: GameSession;
  private currentEventIndex: number = 0;

  // コールバック
  private onGameEnd?: () => Promise<void>;
  private onEventComplete?: (eventIndex: number) => Promise<void>;

  // UI要素
  private catSprite?: Phaser.GameObjects.Image;
  private backgroundImage?: Phaser.GameObjects.Image;
  private textBox?: Phaser.GameObjects.Container;
  private titleText?: Phaser.GameObjects.Text;
  private descriptionText?: Phaser.GameObjects.Text;
  private choiceButtons: Phaser.GameObjects.Container[] = [];
  private confirmButton?: Phaser.GameObjects.Container;
  private selectedChoiceText?: Phaser.GameObjects.Text;

  // アセット管理
  private assetLoader: AssetLoader;
  private assetsReady: boolean = false;

  constructor() {
    super({ key: 'ScenarioScene' });
    logInfo('ScenarioScene: Constructor called');
    this.assetLoader = new AssetLoader();
  }

  /**
   * 初期化（ステートレス設計: ここで状態を受け取る）
   */
  init(data: ScenarioSceneData) {
    logInfo('ScenarioScene: init() called', {
      hasCat: !!data.cat,
      hasScenario: !!data.scenario,
      hasSession: !!data.session
    });

    // 必須データのチェック
    if (!data.cat || !data.scenario || !data.session) {
      const errorMessage = 'Cat, Scenario, Session are required';
      logError('ScenarioScene: ' + errorMessage);
      throw new Error(errorMessage);
    }

    this.cat = data.cat;
    this.scenario = data.scenario;
    this.session = data.session;
    this.currentEventIndex = this.session.currentTurn - 1; // ターン1 = イベント0
    this.onGameEnd = data.onGameEnd;
    this.onEventComplete = data.onEventComplete;
  }

  /**
   * アセット読み込み
   */
  async preload() {
    logInfo('ScenarioScene: preload() started');

    try {
      // 背景画像（仮）- 現在は単色背景を使用
      // this.load.image('background', '/assets/backgrounds/room.png');

      // ねこのイラスト（静止画）
      this.load.image('cat-idle', '/assets/cats/idle.png');
      this.load.image('cat-happy', '/assets/cats/play_1.png');
      this.load.image('cat-sad', '/assets/cats/scared_1.png');

      this.assetsReady = true;
      logInfo('ScenarioScene: preload() completed');
    } catch (error) {
      logError('ScenarioScene: Failed to load assets', {
        error: error instanceof Error ? error.message : String(error)
      });
      this.assetsReady = false;
    }
  }

  /**
   * UI作成
   */
  create() {
    logInfo('ScenarioScene: create() started');

    // 背景
    this.createBackground();

    // ねこのイラスト
    this.createCatSprite();

    // テキストボックス
    this.createTextBox();

    // 最初のイベントを表示
    this.displayCurrentEvent();

    logInfo('ScenarioScene: create() completed');
  }

  /**
   * 背景作成
   */
  private createBackground() {
    // 背景色（空色）
    this.cameras.main.setBackgroundColor('#87CEEB');

    // 背景画像（もし読み込まれていれば）
    if (this.textures.exists('background')) {
      this.backgroundImage = this.add.image(400, 300, 'background');
      this.backgroundImage.setDisplaySize(800, 600);
    }
  }

  /**
   * ねこスプライト作成
   */
  private createCatSprite() {
    // 中央上部にねこを配置
    const catKey = this.textures.exists('cat-idle') ? 'cat-idle' : 'cat-happy';

    if (this.textures.exists(catKey)) {
      this.catSprite = this.add.image(400, 180, catKey);
      this.catSprite.setScale(0.4); // サイズを少し小さく調整
    } else {
      logInfo('ScenarioScene: Cat sprite not found, using placeholder');
      // プレースホルダー（円）
      const graphics = this.add.graphics();
      graphics.fillStyle(0xff9999, 1);
      graphics.fillCircle(400, 180, 40);
    }
  }

  /**
   * テキストボックス作成
   */
  private createTextBox() {
    // テキストボックス（画面中央）
    const boxX = 400;
    const boxY = 330;
    const boxWidth = 700;
    const boxHeight = 120;

    this.textBox = this.add.container(boxX, boxY);

    // 背景（半透明の黒）
    const background = this.add.rectangle(0, 0, boxWidth, boxHeight, 0x000000, 0.8);
    this.textBox.add(background);

    // タイトルテキスト
    this.titleText = this.add.text(-boxWidth / 2 + 20, -boxHeight / 2 + 10, '', {
      fontSize: '22px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    this.textBox.add(this.titleText);

    // 説明テキスト
    this.descriptionText = this.add.text(-boxWidth / 2 + 20, -boxHeight / 2 + 45, '', {
      fontSize: '16px',
      color: '#ffffff',
      wordWrap: { width: boxWidth - 40 }
    });
    this.textBox.add(this.descriptionText);
  }

  /**
   * 現在のイベントを表示
   */
  private displayCurrentEvent() {
    const currentEvent = this.getCurrentEvent();

    if (!currentEvent) {
      logInfo('ScenarioScene: No more events, ending game');
      this.endGame();
      return;
    }

    logInfo('ScenarioScene: Displaying event', {
      eventId: currentEvent.id,
      eventIndex: this.currentEventIndex
    });

    // テキスト更新
    if (this.titleText) {
      this.titleText.setText(currentEvent.title.value);
    }
    if (this.descriptionText) {
      this.descriptionText.setText(currentEvent.description.value);
    }

    // 選択肢ボタン作成
    this.createChoiceButtons(currentEvent.choices);

    // イベント表示時に猫を通常状態に（アニメーション再生）
    this.setCatIdle();
  }

  /**
   * 選択肢ボタン作成
   */
  private createChoiceButtons(choices: readonly Choice[]) {
    // 既存のボタンを削除
    this.choiceButtons.forEach(button => button.destroy());
    this.choiceButtons = [];

    const startY = 430;
    const buttonSpacing = 55;

    choices.forEach((choice, index) => {
      const buttonY = startY + index * buttonSpacing;
      const button = this.createChoiceButton(choice, 400, buttonY, index);
      this.choiceButtons.push(button);
    });
  }

  /**
   * 選択肢ボタン1つ作成
   */
  private createChoiceButton(
    choice: Choice,
    x: number,
    y: number,
    index: number
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    const buttonWidth = 650;
    const buttonHeight = 45;

    // ボタン背景
    const background = this.add.rectangle(0, 0, buttonWidth, buttonHeight, 0x4444ff, 0.85);
    background.setInteractive({ useHandCursor: true });
    container.add(background);

    // ボタンテキスト
    const text = this.add.text(0, 0, choice.text, {
      fontSize: '16px',
      color: '#ffffff'
    });
    text.setOrigin(0.5, 0.5);
    container.add(text);

    // ホバーエフェクト
    background.on('pointerover', () => {
      background.setFillStyle(0x6666ff, 0.9);
    });
    background.on('pointerout', () => {
      background.setFillStyle(0x4444ff, 0.8);
    });

    // クリックイベント
    background.on('pointerdown', () => {
      this.onChoiceSelected(choice, index);
    });

    return container;
  }

  /**
   * 選択肢がクリックされた時の処理
   */
  private onChoiceSelected(choice: Choice, choiceIndex: number) {
    logInfo('ScenarioScene: Choice selected', {
      choiceId: choice.id,
      choiceIndex: choiceIndex
    });

    // ボタンを無効化（連打防止）
    this.choiceButtons.forEach(button => {
      button.getAll().forEach(obj => {
        if (obj instanceof Phaser.GameObjects.Rectangle) {
          obj.removeInteractive();
        }
      });
    });

    // 選択肢を非表示にする
    this.choiceButtons.forEach(button => button.setVisible(false));

    // 選択した内容を表示
    this.showSelectedChoice(choice);

    // 猫が反応する（選択時はhappyアニメーション）
    this.setCatHappy();

    // 確認ボタンを表示
    this.showConfirmButton(choiceIndex);
  }

  /**
   * 選択した選択肢を表示
   */
  private showSelectedChoice(choice: Choice) {
    if (this.selectedChoiceText) {
      this.selectedChoiceText.destroy();
    }

    this.selectedChoiceText = this.add.text(400, 470, `選択: ${choice.text}`, {
      fontSize: '18px',
      color: '#ffff00',
      fontStyle: 'bold',
      backgroundColor: '#000000',
      padding: { x: 15, y: 10 }
    });
    this.selectedChoiceText.setOrigin(0.5, 0.5);
  }

  /**
   * 確認ボタン（次へ）を表示
   */
  private showConfirmButton(choiceIndex: number) {
    if (this.confirmButton) {
      this.confirmButton.destroy();
    }

    const buttonX = 400;
    const buttonY = 530;
    const buttonWidth = 200;
    const buttonHeight = 50;

    this.confirmButton = this.add.container(buttonX, buttonY);

    // ボタン背景
    const background = this.add.rectangle(0, 0, buttonWidth, buttonHeight, 0x44ff44, 0.9);
    background.setInteractive({ useHandCursor: true });
    this.confirmButton.add(background);

    // ボタンテキスト
    const text = this.add.text(0, 0, '次へ >', {
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    text.setOrigin(0.5, 0.5);
    this.confirmButton.add(text);

    // ホバーエフェクト
    background.on('pointerover', () => {
      background.setFillStyle(0x66ff66, 1);
    });
    background.on('pointerout', () => {
      background.setFillStyle(0x44ff44, 0.9);
    });

    // クリックイベント
    background.on('pointerdown', () => {
      this.onConfirmClicked(choiceIndex);
    });
  }

  /**
   * 確認ボタンがクリックされた時の処理
   */
  private async onConfirmClicked(choiceIndex: number) {
    logInfo('ScenarioScene: Confirm button clicked', { choiceIndex });

    // 確認ボタンと選択テキストを削除
    if (this.confirmButton) {
      this.confirmButton.destroy();
      this.confirmButton = undefined;
    }
    if (this.selectedChoiceText) {
      this.selectedChoiceText.destroy();
      this.selectedChoiceText = undefined;
    }

    // イベント完了コールバック呼び出し
    if (this.onEventComplete) {
      await this.onEventComplete(this.currentEventIndex);
    }

    // 次のイベントへ進む
    this.currentEventIndex++;
    this.displayCurrentEvent();
  }

  /**
   * 現在のイベントを取得
   */
  private getCurrentEvent(): Event | undefined {
    return this.scenario.events[this.currentEventIndex];
  }

  /**
   * 現在のイベントインデックスを取得（外部から呼ばれる）
   */
  getCurrentEventIndex(): number {
    return this.currentEventIndex;
  }

  /**
   * ゲーム終了
   */
  async endGame(): Promise<void> {
    logInfo('ScenarioScene: Ending game');

    if (this.onGameEnd) {
      await this.onGameEnd();
    }

    // Scene終了
    this.scene.stop();
  }

  /**
   * シナリオを取得（外部から呼ばれる）
   */
  getScenario(): Scenario {
    return this.scenario;
  }

  /**
   * 猫のアニメーション（スプライト切り替え）
   */
  private playCatAnimation(spriteKey: 'cat-idle' | 'cat-happy' | 'cat-sad') {
    if (!this.catSprite || !this.textures.exists(spriteKey)) {
      logInfo('ScenarioScene: Cat sprite or texture not found', { spriteKey });
      return;
    }

    // スプライトのテクスチャを変更
    this.catSprite.setTexture(spriteKey);

    // 簡単なバウンスアニメーション
    this.tweens.add({
      targets: this.catSprite,
      scaleX: 0.45,
      scaleY: 0.45,
      duration: 200,
      yoyo: true,
      ease: 'Bounce.easeOut'
    });

    logInfo('ScenarioScene: Playing cat animation', { spriteKey });
  }

  /**
   * 猫を通常状態に
   */
  setCatIdle() {
    this.playCatAnimation('cat-idle');
  }

  /**
   * 猫を嬉しい状態に
   */
  setCatHappy() {
    this.playCatAnimation('cat-happy');
  }

  /**
   * 猫を悲しい状態に
   */
  setCatSad() {
    this.playCatAnimation('cat-sad');
  }
}
