/**
 * シナリオ名を表す値オブジェクト
 */
export class ScenarioName {
  private readonly _value: string;

  constructor(value: string) {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new Error('シナリオ名は空にできません');
    }

    if (trimmed.length > 100) {
      throw new Error('シナリオ名は100文字以内にしてください');
    }

    this._value = trimmed;
  }

  get value(): string {
    return this._value;
  }

  equals(other: ScenarioName): boolean {
    return this._value === other._value;
  }
}
