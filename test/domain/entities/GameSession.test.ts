import { GameSession } from '@/domain/game';
import { Cat } from '@/domain/cat';
import { Scenario } from '@/domain/game';
import { ScenarioName } from '@/domain/game';
import { ScenarioPurpose } from '@/domain/game';

describe('GameSession', () => {
  describe('constructor', () => {
    it('正常系: 有効な値で生成できる', () => {
      const cat = Cat.createDefault();
      const scenario = new Scenario(
        'scenario-1',
        new ScenarioName('日常のお世話の継続性'),
        new ScenarioPurpose('毎日のお世話を続けられるか気づかせる'),
        7,
        []
      );

      const session = new GameSession('session-1', cat.id, scenario.id, 1);

      expect(session.id).toBe('session-1');
      expect(session.catId).toBe(cat.id);
      expect(session.scenarioId).toBe('scenario-1');
      expect(session.currentTurn).toBe(1);
    });

    it('異常系: currentTurnが0以下の場合エラー', () => {
      const cat = Cat.createDefault();
      const scenario = new Scenario(
        'scenario-1',
        new ScenarioName('日常のお世話の継続性'),
        new ScenarioPurpose('毎日のお世話を続けられるか気づかせる'),
        7,
        []
      );

      expect(() => new GameSession('session-1', cat.id, scenario.id, 0)).toThrow(
        'ターンは1以上にしてください'
      );
    });

    it('異常系: currentTurnが負の場合エラー', () => {
      const cat = Cat.createDefault();
      const scenario = new Scenario(
        'scenario-1',
        new ScenarioName('日常のお世話の継続性'),
        new ScenarioPurpose('毎日のお世話を続けられるか気づかせる'),
        7,
        []
      );

      expect(() => new GameSession('session-1', cat.id, scenario.id, -1)).toThrow(
        'ターンは1以上にしてください'
      );
    });
  });

  describe('advanceTurn', () => {
    it('正常系: ターンを進めた新しいセッションを返す（不変性）', () => {
      const cat = Cat.createDefault();
      const scenario = new Scenario(
        'scenario-1',
        new ScenarioName('日常のお世話の継続性'),
        new ScenarioPurpose('毎日のお世話を続けられるか気づかせる'),
        7,
        []
      );

      const session = new GameSession('session-1', cat.id, scenario.id, 1);

      const newSession = session.advanceTurn();

      // 元のセッションは変更されない
      expect(session.currentTurn).toBe(1);
      // 新しいセッションはターンが進んでいる
      expect(newSession.currentTurn).toBe(2);
      // その他の属性は同じ
      expect(newSession.id).toBe(session.id);
      expect(newSession.catId).toBe(session.catId);
      expect(newSession.scenarioId).toBe(session.scenarioId);
    });

    it('正常系: 複数回ターンを進められる', () => {
      const cat = Cat.createDefault();
      const scenario = new Scenario(
        'scenario-1',
        new ScenarioName('日常のお世話の継続性'),
        new ScenarioPurpose('毎日のお世話を続けられるか気づかせる'),
        7,
        []
      );

      const session = new GameSession('session-1', cat.id, scenario.id, 1);

      const session2 = session.advanceTurn();
      const session3 = session2.advanceTurn();
      const session4 = session3.advanceTurn();

      // 元のセッションは変更されない
      expect(session.currentTurn).toBe(1);
      // 各セッションは正しいターン数を持つ
      expect(session2.currentTurn).toBe(2);
      expect(session3.currentTurn).toBe(3);
      expect(session4.currentTurn).toBe(4);
    });
  });
});
