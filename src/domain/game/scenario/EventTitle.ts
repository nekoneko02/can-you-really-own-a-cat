/**
 * イベントタイトル値オブジェクト
 */
export class EventTitle {
  private readonly _value: string;

  constructor(value: string) {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new Error('イベントタイトルは空にできません');
    }

    if (trimmed.length > 50) {
      throw new Error('イベントタイトルは50文字以内にしてください');
    }

    this._value = trimmed;
  }

  get value(): string {
    return this._value;
  }

  equals(other: EventTitle): boolean {
    return this._value === other._value;
  }
}
