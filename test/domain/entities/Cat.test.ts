import { Cat } from '@/domain/cat';
import { AffectionLevel } from '@/domain/cat';
import { StressLevel } from '@/domain/cat';
import { Health } from '@/domain/cat';
import { Hunger } from '@/domain/cat';

describe('Cat', () => {
  describe('constructor', () => {
    it('正常系: 初期状態を設定できる', () => {
      const cat = new Cat(
        'test-cat-id',
        'たま',
        new AffectionLevel(50),
        new StressLevel(20),
        new Health(100),
        new Hunger(30)
      );

      expect(cat.id).toBe('test-cat-id');
      expect(cat.name).toBe('たま');
      expect(cat.affectionLevel.value).toBe(50);
      expect(cat.stressLevel.value).toBe(20);
      expect(cat.health.value).toBe(100);
      expect(cat.hunger.value).toBe(30);
    });
  });

  describe('createDefault', () => {
    it('デフォルト値で猫を生成できる', () => {
      const cat = Cat.createDefault('test-id', 'にゃん太');

      expect(cat.id).toBe('test-id');
      expect(cat.name).toBe('にゃん太');
      expect(cat.affectionLevel.value).toBe(50);
      expect(cat.stressLevel.value).toBe(30);
      expect(cat.health.value).toBe(100);
      expect(cat.hunger.value).toBe(50);
    });
  });

  describe('updateAffection', () => {
    it('なつき度を更新した新しいインスタンスを返す', () => {
      const cat = Cat.createDefault('test-id', 'にゃん太');
      const updatedCat = cat.updateAffection(new AffectionLevel(80));

      expect(updatedCat.affectionLevel.value).toBe(80);
      expect(cat.affectionLevel.value).toBe(50); // 元のインスタンスは不変
    });
  });

  describe('updateStress', () => {
    it('ストレス度を更新した新しいインスタンスを返す', () => {
      const cat = Cat.createDefault('test-id', 'にゃん太');
      const updatedCat = cat.updateStress(new StressLevel(60));

      expect(updatedCat.stressLevel.value).toBe(60);
      expect(cat.stressLevel.value).toBe(30);
    });
  });

  describe('updateHealth', () => {
    it('健康度を更新した新しいインスタンスを返す', () => {
      const cat = Cat.createDefault('test-id', 'にゃん太');
      const updatedCat = cat.updateHealth(new Health(70));

      expect(updatedCat.health.value).toBe(70);
      expect(cat.health.value).toBe(100);
    });
  });

  describe('updateHunger', () => {
    it('空腹度を更新した新しいインスタンスを返す', () => {
      const cat = Cat.createDefault('test-id', 'にゃん太');
      const updatedCat = cat.updateHunger(new Hunger(80));

      expect(updatedCat.hunger.value).toBe(80);
      expect(cat.hunger.value).toBe(50);
    });
  });

  describe('feed', () => {
    it('餌を与えると空腹度が減少し、なつき度が増加する', () => {
      const cat = Cat.createDefault('test-id', 'にゃん太');
      const fedCat = cat.feed();

      expect(fedCat.hunger.value).toBeLessThan(cat.hunger.value);
      expect(fedCat.affectionLevel.value).toBeGreaterThan(cat.affectionLevel.value);
    });
  });

  describe('play', () => {
    it('遊ぶとなつき度が増加し、ストレスが減少する', () => {
      const cat = Cat.createDefault('test-id', 'にゃん太');
      const playedCat = cat.play();

      expect(playedCat.affectionLevel.value).toBeGreaterThan(cat.affectionLevel.value);
      expect(playedCat.stressLevel.value).toBeLessThan(cat.stressLevel.value);
    });
  });
});
