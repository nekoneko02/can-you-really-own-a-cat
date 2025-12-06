import { Choice } from './Choice';
import { EventDescription } from './EventDescription';
import { EventResult } from './EventResult';
import { EventTitle } from './EventTitle';

/**
 * ゲーム内イベントを表すエンティティ
 */
export class Event {
  constructor(
    private readonly _id: string,
    private readonly _title: EventTitle,
    private readonly _description: EventDescription,
    private readonly _choices: Choice[],
    private readonly _results: Map<string, EventResult>
  ) {}

  get id(): string {
    return this._id;
  }

  get title(): EventTitle {
    return this._title;
  }

  get description(): EventDescription {
    return this._description;
  }

  get choices(): Choice[] {
    return this._choices;
  }

  /**
   * 選択肢IDから結果を取得
   */
  getResult(choiceId: string): EventResult | undefined {
    return this._results.get(choiceId);
  }

  /**
   * 選択肢IDからChoiceオブジェクトを取得
   */
  getChoiceById(choiceId: string): Choice | undefined {
    return this._choices.find((choice) => choice.id === choiceId);
  }
}
