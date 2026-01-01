/**
 * ScenarioChoiceUI
 *
 * フェーズ内で使用する3択選択肢UI。
 * 質問テキストと3つの選択肢を表示し、クリックまたはキーボードで選択可能。
 */

import Phaser from 'phaser';
import { UIColors, UIFonts } from './UIConstants';

export interface ScenarioChoiceOption {
  label: string; // "A", "B", "C"
  text: string; // 選択肢のテキスト
}

export interface ScenarioChoiceUIOptions {
  scene: Phaser.Scene;
  x: number;
  y: number;
  question: string;
  choices: ScenarioChoiceOption[];
  onSelect: (label: string) => void;
}

interface ChoiceButton {
  background: Phaser.GameObjects.Graphics;
  labelText: Phaser.GameObjects.Text;
  choiceText: Phaser.GameObjects.Text;
  zone: Phaser.GameObjects.Zone;
  label: string;
}

export class ScenarioChoiceUI {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private questionText: Phaser.GameObjects.Text;
  private buttons: ChoiceButton[] = [];
  private onSelect: (label: string) => void;
  private selectedLabel: string | null = null;
  private keyboardHandler: ((event: KeyboardEvent) => void) | null = null;

  // スタイル定数
  private static readonly BUTTON_WIDTH = 280;
  private static readonly BUTTON_HEIGHT = 50;
  private static readonly BUTTON_RADIUS = 10;
  private static readonly BUTTON_SPACING = 60;
  private static readonly LABEL_WIDTH = 40;

  constructor(options: ScenarioChoiceUIOptions) {
    this.scene = options.scene;
    this.onSelect = options.onSelect;

    // コンテナ作成
    this.container = this.scene.add.container(options.x, options.y);
    this.container.setDepth(100);
    this.container.setVisible(false);

    // 質問テキスト作成
    this.questionText = this.scene.add.text(0, -80, options.question, {
      fontSize: UIFonts.titleMedium,
      color: '#ffffff',
      fontFamily: UIFonts.family,
      align: 'center',
    });
    this.questionText.setOrigin(0.5, 0.5);
    this.container.add(this.questionText);

    // 選択肢ボタン作成
    options.choices.forEach((choice, index) => {
      this.createChoiceButton(choice, index);
    });

    // キーボードイベント登録
    this.setupKeyboardInput();
  }

  private createChoiceButton(choice: ScenarioChoiceOption, index: number): void {
    const y = index * ScenarioChoiceUI.BUTTON_SPACING;

    // 背景
    const background = this.scene.add.graphics();
    this.drawButton(background, 0, y, UIColors.choiceNormal);
    this.container.add(background);

    // ラベル (A/B/C)
    const labelText = this.scene.add.text(
      -ScenarioChoiceUI.BUTTON_WIDTH / 2 + ScenarioChoiceUI.LABEL_WIDTH / 2 + 10,
      y,
      choice.label,
      {
        fontSize: UIFonts.button,
        color: '#ffffff',
        fontFamily: UIFonts.family,
        fontStyle: 'bold',
      }
    );
    labelText.setOrigin(0.5, 0.5);
    this.container.add(labelText);

    // 選択肢テキスト
    const textMaxWidth =
      ScenarioChoiceUI.BUTTON_WIDTH - ScenarioChoiceUI.LABEL_WIDTH - 30;
    const choiceText = this.scene.add.text(
      -ScenarioChoiceUI.BUTTON_WIDTH / 2 + ScenarioChoiceUI.LABEL_WIDTH + 20,
      y,
      choice.text,
      {
        fontSize: UIFonts.body,
        color: '#ffffff',
        fontFamily: UIFonts.family,
        wordWrap: { width: textMaxWidth },
      }
    );
    choiceText.setOrigin(0, 0.5);
    this.container.add(choiceText);

    // インタラクティブゾーン
    const zone = this.scene.add.zone(
      0,
      y,
      ScenarioChoiceUI.BUTTON_WIDTH,
      ScenarioChoiceUI.BUTTON_HEIGHT
    );
    zone.setInteractive({ useHandCursor: true });
    this.container.add(zone);

    const button: ChoiceButton = {
      background,
      labelText,
      choiceText,
      zone,
      label: choice.label,
    };

    // ホバーイベント
    zone.on('pointerover', () => {
      if (this.selectedLabel === null) {
        this.drawButton(background, 0, y, UIColors.choiceHover);
      }
    });

    zone.on('pointerout', () => {
      if (this.selectedLabel === null) {
        this.drawButton(background, 0, y, UIColors.choiceNormal);
      }
    });

    // クリックイベント
    zone.on('pointerdown', () => {
      this.selectChoice(button, y);
    });

    this.buttons.push(button);
  }

  private drawButton(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    color: number
  ): void {
    graphics.clear();
    graphics.fillStyle(color, 1);
    graphics.fillRoundedRect(
      x - ScenarioChoiceUI.BUTTON_WIDTH / 2,
      y - ScenarioChoiceUI.BUTTON_HEIGHT / 2,
      ScenarioChoiceUI.BUTTON_WIDTH,
      ScenarioChoiceUI.BUTTON_HEIGHT,
      ScenarioChoiceUI.BUTTON_RADIUS
    );
  }

  private selectChoice(button: ChoiceButton, y: number): void {
    if (this.selectedLabel !== null) return; // 既に選択済み

    this.selectedLabel = button.label;

    // 選択されたボタンをハイライト
    this.drawButton(button.background, 0, y, UIColors.choiceSelected);

    // コールバック通知
    this.onSelect(button.label);
  }

  private setupKeyboardInput(): void {
    this.keyboardHandler = (event: KeyboardEvent) => {
      if (this.selectedLabel !== null) return; // 既に選択済み
      if (!this.container.visible) return; // 非表示時は無視

      const keyMap: Record<string, number> = {
        '1': 0,
        '2': 1,
        '3': 2,
        Digit1: 0,
        Digit2: 1,
        Digit3: 2,
      };

      const index = keyMap[event.key] ?? keyMap[event.code];
      if (index !== undefined && index < this.buttons.length) {
        const button = this.buttons[index];
        const y = index * ScenarioChoiceUI.BUTTON_SPACING;
        this.selectChoice(button, y);
      }
    };

    this.scene.input.keyboard?.on('keydown', this.keyboardHandler);
  }

  /**
   * UIを表示
   */
  show(): void {
    this.container.setVisible(true);
  }

  /**
   * UIを非表示
   */
  hide(): void {
    this.container.setVisible(false);
  }

  /**
   * リソースを解放
   */
  destroy(): void {
    // キーボードイベント解除
    if (this.keyboardHandler) {
      this.scene.input.keyboard?.off('keydown', this.keyboardHandler);
      this.keyboardHandler = null;
    }

    // コンテナ破棄
    this.container.destroy();
  }
}
