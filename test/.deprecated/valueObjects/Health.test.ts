import { Health } from '@/domain/cat';

describe('Health', () => {
  describe('constructor', () => {
    it('正常系: 0-100の範囲内で値を保持できる', () => {
      const health = new Health(80);
      expect(health.value).toBe(80);
    });

    it('異常系: 範囲外の値の場合エラーを投げる', () => {
      expect(() => new Health(-1)).toThrow('Health must be between 0 and 100');
      expect(() => new Health(101)).toThrow('Health must be between 0 and 100');
    });
  });

  describe('increase/decrease', () => {
    it('increase: 正常系', () => {
      const health = new Health(50);
      expect(health.increase(30).value).toBe(80);
    });

    it('decrease: 正常系', () => {
      const health = new Health(80);
      expect(health.decrease(30).value).toBe(50);
    });

    it('境界値: クランプ動作', () => {
      expect(new Health(95).increase(10).value).toBe(100);
      expect(new Health(5).decrease(10).value).toBe(0);
    });
  });
});
