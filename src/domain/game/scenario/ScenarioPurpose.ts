/**
 * シナリオの目的（Why）を表す値オブジェクト
 */
export class ScenarioPurpose {
  private readonly _value: string;

  constructor(value: string) {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new Error('シナリオの目的は空にできません');
    }

    if (trimmed.length > 200) {
      throw new Error('シナリオの目的は200文字以内にしてください');
    }

    this._value = trimmed;
  }

  get value(): string {
    return this._value;
  }

  equals(other: ScenarioPurpose): boolean {
    return this._value === other._value;
  }
}
