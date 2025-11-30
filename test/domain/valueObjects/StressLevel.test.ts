import { StressLevel } from '@/domain/cat';

describe('StressLevel', () => {
  describe('constructor', () => {
    it('正常系: 0-100の範囲内で値を保持できる', () => {
      const level = new StressLevel(50);
      expect(level.value).toBe(50);
    });

    it('異常系: 範囲外の値の場合エラーを投げる', () => {
      expect(() => new StressLevel(-1)).toThrow('StressLevel must be between 0 and 100');
      expect(() => new StressLevel(101)).toThrow('StressLevel must be between 0 and 100');
    });
  });

  describe('increase/decrease', () => {
    it('increase: 正常系', () => {
      const level = new StressLevel(50);
      expect(level.increase(20).value).toBe(70);
    });

    it('decrease: 正常系', () => {
      const level = new StressLevel(50);
      expect(level.decrease(20).value).toBe(30);
    });

    it('境界値: クランプ動作', () => {
      expect(new StressLevel(90).increase(20).value).toBe(100);
      expect(new StressLevel(10).decrease(20).value).toBe(0);
    });
  });
});
