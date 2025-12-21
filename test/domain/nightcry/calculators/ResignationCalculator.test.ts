/**
 * ResignationCalculator のテスト
 */

import { describe, it, expect } from '@jest/globals';
import { ResignationCalculator } from '@/domain/nightcry/calculators/ResignationCalculator';

describe('ResignationCalculator', () => {
  const calculator = new ResignationCalculator();

  describe('calculate', () => {
    it('経過時間が0の場合、諦め度は0を返す', () => {
      const result = calculator.calculate(0, 15 * 60 * 1000);
      expect(result).toBe(0);
    });

    it('経過時間が完了時間の半分の場合、諦め度は0.5を返す', () => {
      const maxTime = 15 * 60 * 1000; // 15分
      const elapsedTime = 7.5 * 60 * 1000; // 7.5分

      const result = calculator.calculate(elapsedTime, maxTime);
      expect(result).toBeCloseTo(0.5, 2);
    });

    it('経過時間が完了時間と同じ場合、諦め度は1.0を返す', () => {
      const maxTime = 15 * 60 * 1000; // 15分
      const elapsedTime = 15 * 60 * 1000; // 15分

      const result = calculator.calculate(elapsedTime, maxTime);
      expect(result).toBe(1.0);
    });

    it('経過時間が完了時間を超えても、諦め度は1.0を超えない', () => {
      const maxTime = 15 * 60 * 1000; // 15分
      const elapsedTime = 30 * 60 * 1000; // 30分

      const result = calculator.calculate(elapsedTime, maxTime);
      expect(result).toBe(1.0);
    });

    it('線形計算が正しく行われる（5分経過）', () => {
      const maxTime = 15 * 60 * 1000; // 15分
      const elapsedTime = 5 * 60 * 1000; // 5分

      const result = calculator.calculate(elapsedTime, maxTime);
      expect(result).toBeCloseTo(0.333, 2); // 5/15 ≈ 0.333
    });

    it('線形計算が正しく行われる（10分経過）', () => {
      const maxTime = 15 * 60 * 1000; // 15分
      const elapsedTime = 10 * 60 * 1000; // 10分

      const result = calculator.calculate(elapsedTime, maxTime);
      expect(result).toBeCloseTo(0.667, 2); // 10/15 ≈ 0.667
    });

    it('完了時間が0の場合、エラーをスローする', () => {
      expect(() => {
        calculator.calculate(100, 0);
      }).toThrow('maxTime must be greater than 0');
    });

    it('経過時間が負の場合、0を返す', () => {
      const result = calculator.calculate(-100, 15 * 60 * 1000);
      expect(result).toBe(0);
    });
  });
});
