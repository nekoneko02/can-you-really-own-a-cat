/**
 * 空腹度を表す値オブジェクト
 * 0-100の範囲で管理される不変オブジェクト
 * 値が高いほど空腹であることを示す
 */
export class Hunger {
  private readonly _value: number;

  constructor(value: number) {
    if (value < 0 || value > 100) {
      throw new Error('Hunger must be between 0 and 100');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  increase(amount: number): Hunger {
    const newValue = Math.min(this._value + amount, 100);
    return new Hunger(newValue);
  }

  decrease(amount: number): Hunger {
    const newValue = Math.max(this._value - amount, 0);
    return new Hunger(newValue);
  }

  equals(other: Hunger): boolean {
    return this._value === other._value;
  }
}
