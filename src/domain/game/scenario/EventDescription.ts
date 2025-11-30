/**
 * イベント説明値オブジェクト
 */
export class EventDescription {
  private readonly _value: string;

  constructor(value: string) {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new Error('イベント説明は空にできません');
    }

    if (trimmed.length > 500) {
      throw new Error('イベント説明は500文字以内にしてください');
    }

    this._value = trimmed;
  }

  get value(): string {
    return this._value;
  }

  equals(other: EventDescription): boolean {
    return this._value === other._value;
  }
}
