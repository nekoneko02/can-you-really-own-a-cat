import { EventDescription } from '@/domain/game';

describe('EventDescription', () => {
  describe('正常系', () => {
    it('正常系: 有効な説明文で生成できる', () => {
      const description = new EventDescription('猫がお腹を空かせて鳴いている');
      expect(description.value).toBe('猫がお腹を空かせて鳴いている');
    });

    it('正常系: 前後の空白は除去される', () => {
      const description = new EventDescription(
        '  猫がお腹を空かせて鳴いている  '
      );
      expect(description.value).toBe('猫がお腹を空かせて鳴いている');
    });
  });

  describe('異常系', () => {
    it('異常系: 空文字列はエラー', () => {
      expect(() => new EventDescription('')).toThrow(
        'イベント説明は空にできません'
      );
    });

    it('異常系: 空白のみはエラー', () => {
      expect(() => new EventDescription('   ')).toThrow(
        'イベント説明は空にできません'
      );
    });

    it('異常系: 500文字を超える場合はエラー', () => {
      const longDescription = 'あ'.repeat(501);
      expect(() => new EventDescription(longDescription)).toThrow(
        'イベント説明は500文字以内にしてください'
      );
    });
  });

  describe('境界値', () => {
    it('境界値: 500文字の説明は許容される', () => {
      const longDescription = 'あ'.repeat(500);
      const description = new EventDescription(longDescription);
      expect(description.value).toBe(longDescription);
    });

    it('境界値: 501文字の説明は拒否される', () => {
      const longDescription = 'あ'.repeat(501);
      expect(() => new EventDescription(longDescription)).toThrow();
    });
  });

  describe('等価性', () => {
    it('等価性: 同じ値のEventDescriptionは等しい', () => {
      const description1 = new EventDescription('猫がお腹を空かせて鳴いている');
      const description2 = new EventDescription('猫がお腹を空かせて鳴いている');
      expect(description1.equals(description2)).toBe(true);
    });

    it('等価性: 異なる値のEventDescriptionは等しくない', () => {
      const description1 = new EventDescription('猫がお腹を空かせて鳴いている');
      const description2 = new EventDescription('猫が遊んでほしそうにしている');
      expect(description1.equals(description2)).toBe(false);
    });
  });
});
