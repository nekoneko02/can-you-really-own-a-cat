import { ScenarioPurpose } from '@/domain/game';

describe('ScenarioPurpose', () => {
  describe('constructor', () => {
    it('正常系: 有効な目的で生成できる', () => {
      const purpose = new ScenarioPurpose(
        '毎日のお世話（餌やり、トイレ掃除）を続けられるか気づかせる'
      );
      expect(purpose.value).toBe(
        '毎日のお世話（餌やり、トイレ掃除）を続けられるか気づかせる'
      );
    });

    it('異常系: 空文字列の場合エラー', () => {
      expect(() => new ScenarioPurpose('')).toThrow(
        'シナリオの目的は空にできません'
      );
    });

    it('異常系: 空白のみの場合エラー', () => {
      expect(() => new ScenarioPurpose('   ')).toThrow(
        'シナリオの目的は空にできません'
      );
    });

    it('境界値: 200文字の目的は許容される', () => {
      const longPurpose = 'あ'.repeat(200);
      const purpose = new ScenarioPurpose(longPurpose);
      expect(purpose.value).toBe(longPurpose);
    });

    it('境界値: 201文字の目的はエラー', () => {
      const tooLongPurpose = 'あ'.repeat(201);
      expect(() => new ScenarioPurpose(tooLongPurpose)).toThrow(
        'シナリオの目的は200文字以内にしてください'
      );
    });
  });

  describe('equals', () => {
    it('正常系: 同じ値のインスタンスは等価', () => {
      const purpose1 = new ScenarioPurpose('睡眠不足になる現実を気づかせる');
      const purpose2 = new ScenarioPurpose('睡眠不足になる現実を気づかせる');
      expect(purpose1.equals(purpose2)).toBe(true);
    });

    it('正常系: 異なる値のインスタンスは非等価', () => {
      const purpose1 = new ScenarioPurpose('睡眠不足になる現実を気づかせる');
      const purpose2 = new ScenarioPurpose('衛生面の現実を気づかせる');
      expect(purpose1.equals(purpose2)).toBe(false);
    });
  });
});
