/**
 * 健康度を表す値オブジェクト
 * 0-100の範囲で管理される不変オブジェクト
 */
export class Health {
  private readonly _value: number;

  constructor(value: number) {
    if (value < 0 || value > 100) {
      throw new Error('Health must be between 0 and 100');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  increase(amount: number): Health {
    const newValue = Math.min(this._value + amount, 100);
    return new Health(newValue);
  }

  decrease(amount: number): Health {
    const newValue = Math.max(this._value - amount, 0);
    return new Health(newValue);
  }

  equals(other: Health): boolean {
    return this._value === other._value;
  }
}
