/**
 * SatisfactionCalculator のテスト
 */

import { describe, it, expect } from '@jest/globals';
import { SatisfactionCalculator } from '@/domain/nightcry/calculators/SatisfactionCalculator';

describe('SatisfactionCalculator', () => {
  const calculator = new SatisfactionCalculator();

  describe('calculate', () => {
    it('経過時間が0の場合、満足度は0を返す', () => {
      const result = calculator.calculate(0, 5 * 60 * 1000);
      expect(result).toBe(0);
    });

    it('経過時間が完了時間の半分の場合、満足度は0.5を返す', () => {
      const maxTime = 5 * 60 * 1000; // 5分
      const elapsedTime = 2.5 * 60 * 1000; // 2.5分

      const result = calculator.calculate(elapsedTime, maxTime);
      expect(result).toBeCloseTo(0.5, 2);
    });

    it('経過時間が完了時間と同じ場合、満足度は1.0を返す', () => {
      const maxTime = 5 * 60 * 1000; // 5分
      const elapsedTime = 5 * 60 * 1000; // 5分

      const result = calculator.calculate(elapsedTime, maxTime);
      expect(result).toBe(1.0);
    });

    it('経過時間が完了時間を超えても、満足度は1.0を超えない', () => {
      const maxTime = 5 * 60 * 1000; // 5分
      const elapsedTime = 10 * 60 * 1000; // 10分

      const result = calculator.calculate(elapsedTime, maxTime);
      expect(result).toBe(1.0);
    });

    it('線形計算が正しく行われる（1分経過）', () => {
      const maxTime = 5 * 60 * 1000; // 5分
      const elapsedTime = 1 * 60 * 1000; // 1分

      const result = calculator.calculate(elapsedTime, maxTime);
      expect(result).toBeCloseTo(0.2, 2); // 1/5 = 0.2
    });

    it('線形計算が正しく行われる（3分経過）', () => {
      const maxTime = 5 * 60 * 1000; // 5分
      const elapsedTime = 3 * 60 * 1000; // 3分

      const result = calculator.calculate(elapsedTime, maxTime);
      expect(result).toBeCloseTo(0.6, 2); // 3/5 = 0.6
    });

    it('完了時間が0の場合、エラーをスローする', () => {
      expect(() => {
        calculator.calculate(100, 0);
      }).toThrow('maxTime must be greater than 0');
    });

    it('経過時間が負の場合、0を返す', () => {
      const result = calculator.calculate(-100, 5 * 60 * 1000);
      expect(result).toBe(0);
    });
  });
});
