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
    it('正常系: ターンを進められる', () => {
      const cat = Cat.createDefault();
      const scenario = new Scenario(
        'scenario-1',
        new ScenarioName('日常のお世話の継続性'),
        new ScenarioPurpose('毎日のお世話を続けられるか気づかせる'),
        7,
        []
      );

      const session = new GameSession('session-1', cat.id, scenario.id, 1);

      session.advanceTurn();

      expect(session.currentTurn).toBe(2);
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

      session.advanceTurn();
      session.advanceTurn();
      session.advanceTurn();

      expect(session.currentTurn).toBe(4);
    });
  });
});
