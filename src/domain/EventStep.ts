import { Choice } from './Choice';

/**
 * イベントステップ
 *
 * イベントの1段階を表現します。
 */
export interface EventStepParams {
  id: string;
  description: string;
  catStateDescription?: string[];
  choices: Choice[];
  soundEffect?: string;
}

export class EventStep {
  public readonly id: string;
  public readonly description: string;
  public readonly catStateDescription: string[];
  public readonly choices: Choice[];
  public readonly soundEffect?: string;

  constructor(params: EventStepParams) {
    this.id = params.id;
    this.description = params.description;
    this.catStateDescription = params.catStateDescription ?? [];
    this.choices = params.choices;
    this.soundEffect = params.soundEffect;
  }

  /**
   * 選択肢を取得
   */
  public getChoices(): Choice[] {
    return this.choices;
  }
}
