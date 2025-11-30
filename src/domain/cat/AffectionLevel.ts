/**
 * なつき度を表す値オブジェクト
 * 0-100の範囲で管理される不変オブジェクト
 */
export class AffectionLevel {
  private readonly _value: number;

  constructor(value: number) {
    if (value < 0 || value > 100) {
      throw new Error('AffectionLevel must be between 0 and 100');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  /**
   * なつき度を増加させた新しいインスタンスを返す
   * 上限100を超える場合は100でクランプされる
   */
  increase(amount: number): AffectionLevel {
    const newValue = Math.min(this._value + amount, 100);
    return new AffectionLevel(newValue);
  }

  /**
   * なつき度を減少させた新しいインスタンスを返す
   * 下限0を下回る場合は0でクランプされる
   */
  decrease(amount: number): AffectionLevel {
    const newValue = Math.max(this._value - amount, 0);
    return new AffectionLevel(newValue);
  }

  /**
   * 値オブジェクトの等価性を判定
   */
  equals(other: AffectionLevel): boolean {
    return this._value === other._value;
  }
}
