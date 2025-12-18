import { Hunger } from '@/domain/cat';

describe('Hunger', () => {
  describe('constructor', () => {
    it('正常系: 0-100の範囲内で値を保持できる', () => {
      const hunger = new Hunger(30);
      expect(hunger.value).toBe(30);
    });

    it('異常系: 範囲外の値の場合エラーを投げる', () => {
      expect(() => new Hunger(-1)).toThrow('Hunger must be between 0 and 100');
      expect(() => new Hunger(101)).toThrow('Hunger must be between 0 and 100');
    });
  });

  describe('increase/decrease', () => {
    it('increase: 空腹度が増える（餌が必要になる）', () => {
      const hunger = new Hunger(30);
      expect(hunger.increase(20).value).toBe(50);
    });

    it('decrease: 空腹度が減る（餌を食べた）', () => {
      const hunger = new Hunger(70);
      expect(hunger.decrease(50).value).toBe(20);
    });

    it('境界値: クランプ動作', () => {
      expect(new Hunger(95).increase(10).value).toBe(100);
      expect(new Hunger(5).decrease(10).value).toBe(0);
    });
  });
});
