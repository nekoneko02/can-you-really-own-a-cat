import { GameService } from '@/application/GameService';
import { Cat } from '@/domain/cat';
import { Event, GameSession, Scenario, ScenarioName, ScenarioPurpose } from '@/domain/game';
import { Choice } from '@/domain/game';
import { EventDescription } from '@/domain/game';
import { EventResult } from '@/domain/game';
import { EventTitle } from '@/domain/game';
import { ParameterChange } from '@/domain/game';

describe('GameService', () => {
  let gameService: GameService;
  let cat: Cat;
  let session: GameSession;
  let scenario: Scenario;

  beforeEach(() => {
    gameService = new GameService();
    cat = Cat.createDefault('test-cat', 'たま');

    const event1 = new Event(
      'event1',
      new EventTitle('イベント1'),
      new EventDescription('説明1'),
      [],
      new Map()
    );
    const event2 = new Event(
      'event2',
      new EventTitle('イベント2'),
      new EventDescription('説明2'),
      [],
      new Map()
    );
    const event3 = new Event(
      'event3',
      new EventTitle('イベント3'),
      new EventDescription('説明3'),
      [],
      new Map()
    );

    scenario = new Scenario(
      'test-scenario',
      new ScenarioName('テストシナリオ'),
      new ScenarioPurpose('テスト用途'),
      3,
      [event1, event2, event3]
    );

    session = new GameSession('test-session', cat.id, scenario.id, 1);
  });

  describe('executeChoice', () => {
    it('選択肢を実行して猫の状態を更新できる', () => {
      const choices = [new Choice('feed', '餌をやる')];
      const results = new Map<string, EventResult>([
        [
          'feed',
          new EventResult('猫は嬉しそうに餌を食べた', [
            new ParameterChange('affection', 10),
            new ParameterChange('hunger', -30),
          ]),
        ],
      ]);

      const event = new Event(
        'morning-feed',
        new EventTitle('朝の餌やり'),
        new EventDescription('猫がお腹を空かせて鳴いている'),
        choices,
        results
      );

      const updatedCat = gameService.executeChoice(cat, event, 'feed');

      expect(updatedCat.affectionLevel.value).toBe(60); // 50 + 10
      expect(updatedCat.hunger.value).toBe(20); // 50 - 30
    });

    it('複数のパラメータ変化を同時に適用できる', () => {
      const choices = [new Choice('ignore', '無視する')];
      const results = new Map<string, EventResult>([
        [
          'ignore',
          new EventResult('猫は不満そうに鳴いている', [
            new ParameterChange('affection', -10),
            new ParameterChange('stress', 15),
            new ParameterChange('hunger', 5),
          ]),
        ],
      ]);

      const event = new Event(
        'test',
        new EventTitle('テストイベント'),
        new EventDescription('テスト説明'),
        choices,
        results
      );
      const updatedCat = gameService.executeChoice(cat, event, 'ignore');

      expect(updatedCat.affectionLevel.value).toBe(40); // 50 - 10
      expect(updatedCat.stressLevel.value).toBe(45); // 30 + 15
      expect(updatedCat.hunger.value).toBe(55); // 50 + 5
    });

    it('境界値を超える場合はクランプされる', () => {
      const choices = [new Choice('big-change', '大きな変化')];
      const results = new Map<string, EventResult>([
        [
          'big-change',
          new EventResult('大きな変化が起きた', [
            new ParameterChange('affection', 100), // 50 + 100 = 150 → 100
            new ParameterChange('stress', -50), // 30 - 50 = -20 → 0
          ]),
        ],
      ]);

      const event = new Event(
        'test',
        new EventTitle('テストイベント'),
        new EventDescription('テスト説明'),
        choices,
        results
      );
      const updatedCat = gameService.executeChoice(cat, event, 'big-change');

      expect(updatedCat.affectionLevel.value).toBe(100); // クランプ
      expect(updatedCat.stressLevel.value).toBe(0); // クランプ
    });

    it('無効な選択肢IDの場合エラーを投げる', () => {
      const event = new Event(
        'test',
        new EventTitle('テストイベント'),
        new EventDescription('テスト説明'),
        [],
        new Map()
      );

      expect(() => {
        gameService.executeChoice(cat, event, 'invalid-choice');
      }).toThrow('Invalid choice ID: invalid-choice');
    });
  });

  describe('getCurrentEvent', () => {
    it('セッションの現在のターンに対応するイベントを取得できる', () => {
      const event = gameService.getCurrentEvent(scenario, session);
      expect(event).toBeDefined();
      expect(event?.id).toBe('event1');
    });

    it('ターン2のイベントを取得できる', () => {
      const session2 = session.advanceTurn();
      const event = gameService.getCurrentEvent(scenario, session2);
      expect(event).toBeDefined();
      expect(event?.id).toBe('event2');
    });

    it('イベントが存在しない場合はundefinedを返す', () => {
      const session4 = session.advanceTurn().advanceTurn().advanceTurn();
      const event = gameService.getCurrentEvent(scenario, session4);
      expect(event).toBeUndefined();
    });
  });

  describe('advanceToNextTurn', () => {
    it('新しいセッションを返す（不変性）', () => {
      const newSession = gameService.advanceToNextTurn(session);
      expect(session.currentTurn).toBe(1); // 元のセッションは変更されない
      expect(newSession.currentTurn).toBe(2);
    });
  });

  describe('isScenarioComplete', () => {
    it('ターン数がイベント数以下の場合はfalseを返す', () => {
      expect(gameService.isScenarioComplete(scenario, session)).toBe(false);
    });

    it('ターン数がイベント数を超えた場合はtrueを返す', () => {
      const session4 = session.advanceTurn().advanceTurn().advanceTurn();
      expect(gameService.isScenarioComplete(scenario, session4)).toBe(true);
    });
  });
});
