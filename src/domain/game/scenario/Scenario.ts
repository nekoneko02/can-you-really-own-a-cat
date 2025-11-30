import { ScenarioName } from './ScenarioName';
import { ScenarioPurpose } from './ScenarioPurpose';
import { Event } from './Event';

/**
 * シナリオエンティティ
 * ユーザーに1つの明確な「気づき」を与える体験の単位
 */
export class Scenario {
  private readonly _id: string;
  private readonly _name: ScenarioName;
  private readonly _purpose: ScenarioPurpose;
  private readonly _duration: number;
  private readonly _events: Event[];

  constructor(
    id: string,
    name: ScenarioName,
    purpose: ScenarioPurpose,
    duration: number,
    events: Event[]
  ) {
    if (duration <= 0) {
      throw new Error('シナリオの期間は1以上にしてください');
    }

    this._id = id;
    this._name = name;
    this._purpose = purpose;
    this._duration = duration;
    this._events = [...events];
  }

  get id(): string {
    return this._id;
  }

  get name(): ScenarioName {
    return this._name;
  }

  get purpose(): ScenarioPurpose {
    return this._purpose;
  }

  get duration(): number {
    return this._duration;
  }

  get events(): readonly Event[] {
    return this._events;
  }

  /**
   * イベントを追加する
   */
  addEvent(event: Event): void {
    this._events.push(event);
  }

  /**
   * IDでイベントを取得する
   */
  getEventById(eventId: string): Event | undefined {
    return this._events.find((e) => e.id === eventId);
  }
}
