/**
 * EventUIManager
 *
 * イベントUIの表示・非表示を管理します。
 * GameViewのcurrentEventまたはcurrentScenarioStepを監視し、イベント発生時にDialogSystemと選択肢ボタンを表示します。
 */

import { GameEvent } from '@/domain/GameEvent';
import { EventStep } from '@/domain/EventStep';
import { PhaserGameController } from '@/phaser/controllers/PhaserGameController';
import { DialogSystem } from './DialogSystem';
import { ChoiceButton } from './ChoiceButton';

export class EventUIManager {
  private scene: Phaser.Scene;
  private controller: PhaserGameController;
  private dialogSystem: DialogSystem;
  private choiceButtons: ChoiceButton[] = [];
  private currentEvent: GameEvent | null = null;
  private currentScenarioStep: EventStep | null = null;

  constructor(scene: Phaser.Scene, controller: PhaserGameController) {
    this.scene = scene;
    this.controller = controller;
    this.dialogSystem = new DialogSystem(scene);
  }

  /**
   * GameViewを監視し、イベント表示を制御
   * @param currentEvent 現在のイベント（GameView.currentEvent）
   * @param currentScenarioStep 現在のシナリオステップ（GameView.currentScenarioStep）
   */
  update(currentEvent: GameEvent | null, currentScenarioStep: EventStep | null = null): void {
    // シナリオステップが優先（Phase 4以降）
    if (currentScenarioStep) {
      this.updateScenarioStep(currentScenarioStep);
      return;
    }

    // 従来のイベント処理（Phase 1-3）
    this.updateEvent(currentEvent);
  }

  /**
   * EventStepの表示を制御
   */
  private updateScenarioStep(step: EventStep): void {
    // ステップが変わったら表示を更新
    if (!this.currentScenarioStep || step.id !== this.currentScenarioStep.id) {
      this.hideEvent();
      this.showStep(step);
      this.currentScenarioStep = step;
    }
  }

  /**
   * GameEventの表示を制御（従来のロジック）
   */
  private updateEvent(currentEvent: GameEvent | null): void {
    // シナリオステップが表示されている場合はクリア
    if (this.currentScenarioStep) {
      this.hideEvent();
      this.currentScenarioStep = null;
    }

    // イベントが発生したら表示
    if (currentEvent && !this.currentEvent) {
      this.showEvent(currentEvent);
      this.currentEvent = currentEvent;
      return;
    }

    // イベントが終了したら非表示
    if (!currentEvent && this.currentEvent) {
      this.hideEvent();
      this.currentEvent = null;
      return;
    }

    // 異なるイベントに切り替わった場合
    if (currentEvent && this.currentEvent && currentEvent.id !== this.currentEvent.id) {
      this.hideEvent();
      this.showEvent(currentEvent);
      this.currentEvent = currentEvent;
    }
  }

  /**
   * イベントが表示されているかどうか
   */
  isEventShown(): boolean {
    return this.currentEvent !== null;
  }

  /**
   * 現在表示されているイベントのID
   */
  getDisplayedEventId(): string | null {
    return this.currentEvent?.id ?? null;
  }

  /**
   * イベントUIを表示
   * @param event イベント
   */
  private showEvent(event: GameEvent): void {
    // ダイアログシステムを表示
    this.dialogSystem.show(event.title, event.description, event.catStateDescription);

    // 選択肢ボタンを生成
    this.createChoiceButtons(event.choices);
  }

  /**
   * EventStepを表示
   * @param step イベントステップ
   */
  private showStep(step: EventStep): void {
    // ダイアログシステムを表示（タイトルなし、descriptionのみ）
    this.dialogSystem.show('', step.description, step.catStateDescription);

    // 選択肢ボタンを生成
    this.createChoiceButtons(step.choices);
  }

  /**
   * イベントUIを非表示
   */
  private hideEvent(): void {
    this.dialogSystem.hide();
    this.clearChoiceButtons();
    this.currentScenarioStep = null;
  }

  /**
   * 選択肢ボタンを生成
   * @param choices 選択肢の配列
   */
  private createChoiceButtons(choices: any[]): void {
    const buttonY = 330; // ダイアログの上に配置
    const buttonSpacing = 70;

    choices.forEach((choice, index) => {
      const button = new ChoiceButton(
        this.scene,
        400, // 中央
        buttonY - index * buttonSpacing,
        choice.text,
        () => this.onChoiceSelected(choice.id)
      );
      this.choiceButtons.push(button);
    });
  }

  /**
   * 選択肢ボタンをすべて破棄
   */
  private clearChoiceButtons(): void {
    this.choiceButtons.forEach((button) => button.destroy());
    this.choiceButtons = [];
  }

  /**
   * 選択肢が選択された時の処理
   * @param choiceId 選択肢のID
   */
  private onChoiceSelected(choiceId: string): void {
    // GameControllerに選択肢を送信
    this.controller.tick({ choice: choiceId });
  }

  /**
   * EventUIManagerを破棄
   */
  destroy(): void {
    this.dialogSystem.destroy();
    this.clearChoiceButtons();
  }
}
