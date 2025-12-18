import { ScenarioName } from '@/domain/game';

describe('ScenarioName', () => {
  describe('constructor', () => {
    it('正常系: 有効な名前で生成できる', () => {
      const name = new ScenarioName('日常のお世話の継続性');
      expect(name.value).toBe('日常のお世話の継続性');
    });

    it('異常系: 空文字列の場合エラー', () => {
      expect(() => new ScenarioName('')).toThrow('シナリオ名は空にできません');
    });

    it('異常系: 空白のみの場合エラー', () => {
      expect(() => new ScenarioName('   ')).toThrow('シナリオ名は空にできません');
    });

    it('境界値: 100文字の名前は許容される', () => {
      const longName = 'あ'.repeat(100);
      const name = new ScenarioName(longName);
      expect(name.value).toBe(longName);
    });

    it('境界値: 101文字の名前はエラー', () => {
      const tooLongName = 'あ'.repeat(101);
      expect(() => new ScenarioName(tooLongName)).toThrow(
        'シナリオ名は100文字以内にしてください'
      );
    });
  });

  describe('equals', () => {
    it('正常系: 同じ値のインスタンスは等価', () => {
      const name1 = new ScenarioName('日常のお世話の継続性');
      const name2 = new ScenarioName('日常のお世話の継続性');
      expect(name1.equals(name2)).toBe(true);
    });

    it('正常系: 異なる値のインスタンスは非等価', () => {
      const name1 = new ScenarioName('日常のお世話の継続性');
      const name2 = new ScenarioName('睡眠への影響');
      expect(name1.equals(name2)).toBe(false);
    });
  });
});
