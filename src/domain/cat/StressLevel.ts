/**
 * ストレス度を表す値オブジェクト
 * 0-100の範囲で管理される不変オブジェクト
 */
export class StressLevel {
  private readonly _value: number;

  constructor(value: number) {
    if (value < 0 || value > 100) {
      throw new Error('StressLevel must be between 0 and 100');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  increase(amount: number): StressLevel {
    const newValue = Math.min(this._value + amount, 100);
    return new StressLevel(newValue);
  }

  decrease(amount: number): StressLevel {
    const newValue = Math.max(this._value - amount, 0);
    return new StressLevel(newValue);
  }

  equals(other: StressLevel): boolean {
    return this._value === other._value;
  }
}
