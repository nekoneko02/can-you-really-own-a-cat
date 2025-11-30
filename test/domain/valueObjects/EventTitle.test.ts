import { EventTitle } from '@/domain/game';

describe('EventTitle', () => {
  describe('正常系', () => {
    it('正常系: 有効なタイトルで生成できる', () => {
      const title = new EventTitle('朝の餌やり');
      expect(title.value).toBe('朝の餌やり');
    });

    it('正常系: 前後の空白は除去される', () => {
      const title = new EventTitle('  朝の餌やり  ');
      expect(title.value).toBe('朝の餌やり');
    });
  });

  describe('異常系', () => {
    it('異常系: 空文字列はエラー', () => {
      expect(() => new EventTitle('')).toThrow(
        'イベントタイトルは空にできません'
      );
    });

    it('異常系: 空白のみはエラー', () => {
      expect(() => new EventTitle('   ')).toThrow(
        'イベントタイトルは空にできません'
      );
    });

    it('異常系: 50文字を超える場合はエラー', () => {
      const longTitle = 'あ'.repeat(51);
      expect(() => new EventTitle(longTitle)).toThrow(
        'イベントタイトルは50文字以内にしてください'
      );
    });
  });

  describe('境界値', () => {
    it('境界値: 50文字のタイトルは許容される', () => {
      const longTitle = 'あ'.repeat(50);
      const title = new EventTitle(longTitle);
      expect(title.value).toBe(longTitle);
    });

    it('境界値: 51文字のタイトルは拒否される', () => {
      const longTitle = 'あ'.repeat(51);
      expect(() => new EventTitle(longTitle)).toThrow();
    });
  });

  describe('等価性', () => {
    it('等価性: 同じ値のEventTitleは等しい', () => {
      const title1 = new EventTitle('朝の餌やり');
      const title2 = new EventTitle('朝の餌やり');
      expect(title1.equals(title2)).toBe(true);
    });

    it('等価性: 異なる値のEventTitleは等しくない', () => {
      const title1 = new EventTitle('朝の餌やり');
      const title2 = new EventTitle('夜の餌やり');
      expect(title1.equals(title2)).toBe(false);
    });
  });
});
