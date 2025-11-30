import { Event } from '@/domain/game';
import { Choice } from '@/domain/game';
import { EventDescription } from '@/domain/game';
import { EventResult } from '@/domain/game';
import { EventTitle } from '@/domain/game';
import { ParameterChange } from '@/domain/game';

describe('Event', () => {
  it('イベントを作成できる', () => {
    const choices = [
      new Choice('choice1', '餌をやる'),
      new Choice('choice2', '無視する'),
    ];

    const results = new Map<string, EventResult>([
      [
        'choice1',
        new EventResult('猫は嬉しそうに餌を食べた', [
          new ParameterChange('affection', 5),
          new ParameterChange('hunger', -30),
        ]),
      ],
      [
        'choice2',
        new EventResult('猫は不満そうに鳴いている', [
          new ParameterChange('affection', -5),
          new ParameterChange('stress', 10),
        ]),
      ],
    ]);

    const event = new Event(
      'event1',
      new EventTitle('朝の餌やり'),
      new EventDescription('猫がお腹を空かせて鳴いている'),
      choices,
      results
    );

    expect(event.id).toBe('event1');
    expect(event.title.value).toBe('朝の餌やり');
    expect(event.description.value).toBe('猫がお腹を空かせて鳴いている');
    expect(event.choices).toHaveLength(2);
  });

  it('選択肢IDから結果を取得できる', () => {
    const choices = [new Choice('choice1', '餌をやる')];

    const results = new Map<string, EventResult>([
      [
        'choice1',
        new EventResult('猫は嬉しそうに餌を食べた', [
          new ParameterChange('affection', 5),
        ]),
      ],
    ]);

    const event = new Event(
      'event1',
      new EventTitle('朝の餌やり'),
      new EventDescription('猫がお腹を空かせて鳴いている'),
      choices,
      results
    );

    const result = event.getResult('choice1');
    expect(result).toBeDefined();
    expect(result?.resultText).toBe('猫は嬉しそうに餌を食べた');
    expect(result?.changes).toHaveLength(1);
    expect(result?.changes[0].parameterType).toBe('affection');
    expect(result?.changes[0].changeAmount).toBe(5);
  });

  it('存在しない選択肢IDの場合undefinedを返す', () => {
    const event = new Event(
      'event1',
      new EventTitle('テストイベント'),
      new EventDescription('テスト説明'),
      [],
      new Map()
    );
    expect(event.getResult('invalid-choice')).toBeUndefined();
  });
});
