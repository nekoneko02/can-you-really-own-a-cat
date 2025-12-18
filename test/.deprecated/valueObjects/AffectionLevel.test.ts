import { AffectionLevel } from '@/domain/cat';

describe('AffectionLevel', () => {
  describe('constructor', () => {
    it('正常系: 0-100の範囲内で値を保持できる', () => {
      const level = new AffectionLevel(50);
      expect(level.value).toBe(50);
    });

    it('境界値: 0を受け入れる', () => {
      const level = new AffectionLevel(0);
      expect(level.value).toBe(0);
    });

    it('境界値: 100を受け入れる', () => {
      const level = new AffectionLevel(100);
      expect(level.value).toBe(100);
    });

    it('異常系: -1の場合エラーを投げる', () => {
      expect(() => new AffectionLevel(-1)).toThrow('AffectionLevel must be between 0 and 100');
    });

    it('異常系: 101の場合エラーを投げる', () => {
      expect(() => new AffectionLevel(101)).toThrow('AffectionLevel must be between 0 and 100');
    });
  });

  describe('increase', () => {
    it('正常系: 指定した値だけ増加する', () => {
      const level = new AffectionLevel(50);
      const increased = level.increase(20);
      expect(increased.value).toBe(70);
    });

    it('境界値: 上限を超えた場合は100でクランプする', () => {
      const level = new AffectionLevel(90);
      const increased = level.increase(20);
      expect(increased.value).toBe(100);
    });

    it('不変性: 元のインスタンスは変更されない', () => {
      const level = new AffectionLevel(50);
      level.increase(20);
      expect(level.value).toBe(50);
    });
  });

  describe('decrease', () => {
    it('正常系: 指定した値だけ減少する', () => {
      const level = new AffectionLevel(50);
      const decreased = level.decrease(20);
      expect(decreased.value).toBe(30);
    });

    it('境界値: 下限を超えた場合は0でクランプする', () => {
      const level = new AffectionLevel(10);
      const decreased = level.decrease(20);
      expect(decreased.value).toBe(0);
    });

    it('不変性: 元のインスタンスは変更されない', () => {
      const level = new AffectionLevel(50);
      level.decrease(20);
      expect(level.value).toBe(50);
    });
  });

  describe('equals', () => {
    it('正常系: 同じ値の場合trueを返す', () => {
      const level1 = new AffectionLevel(50);
      const level2 = new AffectionLevel(50);
      expect(level1.equals(level2)).toBe(true);
    });

    it('正常系: 異なる値の場合falseを返す', () => {
      const level1 = new AffectionLevel(50);
      const level2 = new AffectionLevel(60);
      expect(level1.equals(level2)).toBe(false);
    });
  });
});
