import { Scenario } from '@/domain/game';
import { ScenarioName } from '@/domain/game';
import { ScenarioPurpose } from '@/domain/game';
import { Event } from '@/domain/game';
import { Choice } from '@/domain/game';
import { EventDescription } from '@/domain/game';
import { EventResult } from '@/domain/game';
import { EventTitle } from '@/domain/game';
import { ParameterChange } from '@/domain/game';

describe('Scenario', () => {
  describe('constructor', () => {
    it('正常系: 有効な値で生成できる', () => {
      const scenario = new Scenario(
        'scenario-1',
        new ScenarioName('日常のお世話の継続性'),
        new ScenarioPurpose('毎日のお世話を続けられるか気づかせる'),
        7,
        []
      );

      expect(scenario.id).toBe('scenario-1');
      expect(scenario.name.value).toBe('日常のお世話の継続性');
      expect(scenario.purpose.value).toBe('毎日のお世話を続けられるか気づかせる');
      expect(scenario.duration).toBe(7);
      expect(scenario.events).toEqual([]);
    });

    it('正常系: イベントを含めて生成できる', () => {
      const event = new Event(
        'event-1',
        new EventTitle('朝の餌やり'),
        new EventDescription('朝6時、猫が鳴いています'),
        [new Choice('feed', '餌をやる')],
        new Map([
          [
            'feed',
            new EventResult('猫は嬉しそうに食べました', [
              new ParameterChange('affection', 10),
            ]),
          ],
        ])
      );

      const scenario = new Scenario(
        'scenario-1',
        new ScenarioName('日常のお世話の継続性'),
        new ScenarioPurpose('毎日のお世話を続けられるか気づかせる'),
        7,
        [event]
      );

      expect(scenario.events.length).toBe(1);
      expect(scenario.events[0].id).toBe('event-1');
    });

    it('異常系: duration が 0 以下の場合エラー', () => {
      expect(
        () =>
          new Scenario(
            'scenario-1',
            new ScenarioName('日常のお世話の継続性'),
            new ScenarioPurpose('毎日のお世話を続けられるか気づかせる'),
            0,
            []
          )
      ).toThrow('シナリオの期間は1以上にしてください');
    });

    it('異常系: duration が負の場合エラー', () => {
      expect(
        () =>
          new Scenario(
            'scenario-1',
            new ScenarioName('日常のお世話の継続性'),
            new ScenarioPurpose('毎日のお世話を続けられるか気づかせる'),
            -1,
            []
          )
      ).toThrow('シナリオの期間は1以上にしてください');
    });
  });

  describe('addEvent', () => {
    it('正常系: イベントを追加できる', () => {
      const scenario = new Scenario(
        'scenario-1',
        new ScenarioName('日常のお世話の継続性'),
        new ScenarioPurpose('毎日のお世話を続けられるか気づかせる'),
        7,
        []
      );

      const event = new Event(
        'event-1',
        new EventTitle('朝の餌やり'),
        new EventDescription('朝6時、猫が鳴いています'),
        [new Choice('feed', '餌をやる')],
        new Map([
          [
            'feed',
            new EventResult('猫は嬉しそうに食べました', [
              new ParameterChange('affection', 10),
            ]),
          ],
        ])
      );

      scenario.addEvent(event);

      expect(scenario.events.length).toBe(1);
      expect(scenario.events[0].id).toBe('event-1');
    });
  });

  describe('getEventById', () => {
    it('正常系: IDでイベントを取得できる', () => {
      const event1 = new Event(
        'event-1',
        new EventTitle('朝の餌やり'),
        new EventDescription('朝6時、猫が鳴いています'),
        [new Choice('feed', '餌をやる')],
        new Map([
          [
            'feed',
            new EventResult('猫は嬉しそうに食べました', [
              new ParameterChange('affection', 10),
            ]),
          ],
        ])
      );

      const event2 = new Event(
        'event-2',
        new EventTitle('トイレ掃除'),
        new EventDescription('出勤前、トイレを見ると...'),
        [new Choice('clean', '掃除する')],
        new Map([
          [
            'clean',
            new EventResult('きれいになりました', [
              new ParameterChange('stress', -10),
            ]),
          ],
        ])
      );

      const scenario = new Scenario(
        'scenario-1',
        new ScenarioName('日常のお世話の継続性'),
        new ScenarioPurpose('毎日のお世話を続けられるか気づかせる'),
        7,
        [event1, event2]
      );

      const found = scenario.getEventById('event-2');
      expect(found).toBeDefined();
      expect(found!.id).toBe('event-2');
    });

    it('正常系: 存在しないIDの場合undefinedを返す', () => {
      const scenario = new Scenario(
        'scenario-1',
        new ScenarioName('日常のお世話の継続性'),
        new ScenarioPurpose('毎日のお世話を続けられるか気づかせる'),
        7,
        []
      );

      const found = scenario.getEventById('event-999');
      expect(found).toBeUndefined();
    });
  });
});
