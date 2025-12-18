import { EventStep } from './EventStep';
import { Consequence } from './Consequence';

/**
 * イベントシナリオ
 *
 * 複数段階の選択を持つイベントの流れを管理します。
 */
export interface EventScenarioParams {
  id: string;
  title: string;
  initialStepId: string;
  steps: EventStep[];
}

export class EventScenario {
  public readonly id: string;
  public readonly title: string;
  private currentStepId: string | null;
  private steps: Map<string, EventStep>;
  private history: ChoiceRecord[];
  private completed: boolean;

  constructor(params: EventScenarioParams) {
    this.id = params.id;
    this.title = params.title;
    this.currentStepId = params.initialStepId;
    this.steps = new Map(params.steps.map((step) => [step.id, step]));
    this.history = [];
    this.completed = false;
  }

  /**
   * 現在のステップを取得
   */
  public getCurrentStep(): EventStep | null {
    if (!this.currentStepId) {
      return null;
    }
    return this.steps.get(this.currentStepId) ?? null;
  }

  /**
   * 選択肢を実行し、次のステップに進む
   * @returns 実行結果（結果、次のステップID、完了フラグ）
   */
  public executeChoice(choiceId: string): EventStepResult {
    const currentStep = this.getCurrentStep();
    if (!currentStep) {
      throw new Error(
        `[EventScenario] Current step not found: ${this.currentStepId}`
      );
    }

    const choice = currentStep.choices.find((c) => c.id === choiceId);
    if (!choice) {
      throw new Error(`[EventScenario] Choice not found: ${choiceId}`);
    }

    // 選択を実行
    const consequence = choice.execute();

    // 履歴に記録（currentStepIdは確実にstringのはず）
    this.history.push({
      stepId: currentStep.id,
      choiceId: choice.id,
      timestamp: Date.now(),
    });

    // 次のステップIDを取得（Choiceから）
    const nextStepId = choice.nextStepId ?? null;

    // ステップを進める
    if (nextStepId) {
      this.currentStepId = nextStepId;
    } else {
      // 完了した場合、currentStepIdをnullにする
      this.currentStepId = null;
      this.completed = true;
    }

    // 完了判定
    const isCompleted = nextStepId === null;

    return {
      consequence,
      nextStepId,
      isCompleted,
    };
  }

  /**
   * シナリオが完了したか判定
   */
  public isCompleted(): boolean {
    return this.completed;
  }

  /**
   * 選択履歴を取得
   */
  public getHistory(): ChoiceRecord[] {
    return [...this.history];
  }
}

/**
 * 選択記録
 */
export interface ChoiceRecord {
  stepId: string;
  choiceId: string;
  timestamp: number;
}

/**
 * ステップ実行結果
 */
export interface EventStepResult {
  consequence: Consequence;
  nextStepId: string | null; // null = シナリオ完了
  isCompleted: boolean;
}
