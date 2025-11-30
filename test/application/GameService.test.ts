import { GameService } from '@/application/GameService';
import { Cat } from '@/domain/cat';
import { Event } from '@/domain/game';
import { Choice } from '@/domain/game';
import { EventDescription } from '@/domain/game';
import { EventResult } from '@/domain/game';
import { EventTitle } from '@/domain/game';
import { ParameterChange } from '@/domain/game';

describe('GameService', () => {
  let gameService: GameService;
  let cat: Cat;

  beforeEach(() => {
    gameService = new GameService();
    cat = Cat.createDefault('test-cat', 'たま');
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
});
