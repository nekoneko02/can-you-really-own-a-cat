/**
 * Game - イベントシステムのテスト
 *
 * Phase 1の実装に対するテスト:
 * - checkEventTrigger()
 * - executeChoice()
 * - イベントライフサイクル
 */

import { Game } from '@/domain/Game';
import { GamePhase } from '@/domain/types';

describe('Game - Event System', () => {
  describe('checkEventTrigger', () => {
    it('should not trigger event in NIGHT_PREP phase', () => {
      const game = new Game({ scenarioId: 'night_crying' });

      expect(game.getPhase()).toBe(GamePhase.NIGHT_PREP);

      game.update(); // checkEventTrigger()を呼び出す

      const currentEvent = game['currentEvent']; // private fieldへのアクセス
      expect(currentEvent).toBeNull();
    });

    it('should trigger scenario based on schedule', () => {
      const game = new Game({ scenarioId: 'night_crying' });

      // 初日はスケジュールに必ず含まれる
      game.transitionToMidnight();
      expect(game.getPhase()).toBe(GamePhase.MIDNIGHT_EVENT);

      game.update(); // checkEventTrigger()を呼び出す

      const currentScenario = game['currentScenario'];
      expect(currentScenario).not.toBeNull();
      expect(currentScenario?.id).toBe('night_crying_day1');
    });

    it('should not trigger second scenario if currentScenario is not null', () => {
      const game = new Game({ scenarioId: 'night_crying' });

      // 初日
      game.transitionToMidnight();
      game.update(); // 最初のシナリオを発火

      const firstScenario = game['currentScenario'];
      expect(firstScenario).not.toBeNull();

      game.update(); // 2回目のupdate

      const secondScenario = game['currentScenario'];
      expect(secondScenario).toBe(firstScenario); // 同じインスタンスのまま
    });
  });

  describe('executeChoice', () => {
    it('should execute scenario choice and apply consequences', () => {
      const game = new Game({ scenarioId: 'night_crying' });

      // 初日のシナリオを発火
      game.transitionToMidnight();
      game.update();

      const currentScenario = game['currentScenario'];
      expect(currentScenario).not.toBeNull();

      // 初期ステータスを取得
      const catStatusManager = game['catStatusManager'];
      const playerStats = game['playerStats'];

      const initialAffection = catStatusManager.getStatus().affection;
      const initialInterruptionCount = playerStats.interruptionCount;

      // 選択肢を実行
      game.executeChoice('investigate');
      game.executeChoice('play');

      // 結果を検証
      const updatedAffection = catStatusManager.getStatus().affection;
      expect(updatedAffection).toBe(initialAffection + 10); // affectionが+10される

      const updatedInterruptionCount = playerStats.interruptionCount;
      expect(updatedInterruptionCount).toBe(initialInterruptionCount + 2);

      // シナリオが完了していることを確認
      const scenarioAfter = game['currentScenario'];
      expect(scenarioAfter).toBeNull();

      // 気持ち入力待ち状態になっていることを確認
      expect(game.isWaitingForEmotionInput()).toBe(true);
    });

    it('should warn if no event is active', () => {
      const game = new Game({ scenarioId: 'night_crying' });
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      game.executeChoice('wait');

      expect(consoleSpy).toHaveBeenCalledWith('[Game] イベントが発生していません');

      consoleSpy.mockRestore();
    });

    it('should throw error if choice not found in scenario', () => {
      const game = new Game({ scenarioId: 'night_crying' });

      // 初日のシナリオを発火
      game.transitionToMidnight();
      game.update();

      expect(() => {
        game.executeChoice('invalid_choice_id');
      }).toThrow('[EventScenario] Choice not found: invalid_choice_id');
    });
  });

  describe('event lifecycle', () => {
    it('should complete full scenario lifecycle', () => {
      const game = new Game({ scenarioId: 'night_crying' });

      // 1. 夜フェーズから開始
      expect(game.getPhase()).toBe(GamePhase.NIGHT_PREP);
      expect(game['currentScenario']).toBeNull();

      // 2. 夜中フェーズに移行
      game.transitionToMidnight();
      expect(game.getPhase()).toBe(GamePhase.MIDNIGHT_EVENT);

      // 3. シナリオが発火
      game.update();
      expect(game['currentScenario']).not.toBeNull();

      // 4. 選択肢を実行
      game.executeChoice('investigate');
      game.executeChoice('play');

      // 5. シナリオが完了
      expect(game['currentScenario']).toBeNull();
      expect(game.isWaitingForEmotionInput()).toBe(true);

      // 6. 気持ちを記録
      game.recordEmotionForCurrentEvent({
        satisfaction: 3,
        burden: 3,
      });

      // 7. 朝フェーズに移行可能（RoomSceneが行う）
      game.transitionToMorning();
      expect(game.getPhase()).toBe(GamePhase.MORNING_OUTRO);
    });

    it('should handle multiple scenarios across days based on schedule', () => {
      const game = new Game({ scenarioId: 'night_crying' });

      for (let day = 1; day <= 3; day++) {
        // 夜中フェーズに移行
        game.transitionToMidnight();

        // シナリオ発火
        game.update();

        // スケジュールに基づいてシナリオが発火（または発火しない）
        if (game['currentScenario']) {
          // シナリオの選択肢を実行（遊んであげて完了）
          game.executeChoice('investigate');
          game.executeChoice('play');
          expect(game['currentScenario']).toBeNull();

          // 気持ち入力をスキップ
          if (game.isWaitingForEmotionInput()) {
            game.recordEmotionForCurrentEvent({
              satisfaction: 3,
              burden: 3,
            });
          }
        }

        // 朝フェーズ
        game.transitionToMorning();

        // 次の日へ
        if (day < 3) {
          game.advanceToNextDay();
        }
      }

      expect(game.getCurrentDay()).toBe(3);
    });
  });

  describe('emotion input', () => {
    it('should wait for emotion after scenario completion', () => {
      const game = new Game({ scenarioId: 'night_crying' });

      game.transitionToMidnight();
      game.update();

      // シナリオを完了させる
      game.executeChoice('investigate');
      game.executeChoice('play');

      // 気持ち入力待ち状態
      expect(game.isWaitingForEmotionInput()).toBe(true);
    });

    it('should record emotion', () => {
      const game = new Game({ scenarioId: 'night_crying' });

      game.transitionToMidnight();
      game.update();
      game.executeChoice('investigate');
      game.executeChoice('play');

      // 気持ちを記録
      game.recordEmotionForCurrentEvent({
        satisfaction: 3,
        burden: 4,
        freeText: 'テスト',
      });

      // 気持ち入力完了
      expect(game.isWaitingForEmotionInput()).toBe(false);

      // イベント履歴に記録されている
      const history = game.getEventHistory();
      expect(history.length).toBeGreaterThan(0);
      expect(history[history.length - 1].emotion.satisfaction).toBe(3);
    });
  });

  describe('multiple event occurrences (Phase 6)', () => {
    it('should trigger event on day 1', () => {
      const game = new Game({ scenarioId: 'night_crying' });

      // Day 1
      game.transitionToMidnight();
      game.update();

      expect(game['currentScenario']).not.toBeNull();
    });

    it('should trigger events exactly 3 times in 7 days', () => {
      const game = new Game({ scenarioId: 'night_crying' });

      let eventCount = 0;

      for (let day = 1; day <= 7; day++) {
        // 夜中フェーズに移行
        game.transitionToMidnight();
        game.update();

        // イベントが発生したか確認
        if (game['currentScenario']) {
          eventCount++;

          // イベントを完了させる
          game.executeChoice('investigate');
          game.executeChoice('play');

          // 気持ち入力をスキップ
          if (game.isWaitingForEmotionInput()) {
            game.recordEmotionForCurrentEvent({
              satisfaction: 3,
              burden: 3,
            });
          }
        }

        // 朝フェーズに移行
        game.transitionToMorning();

        // 次の日へ
        if (day < 7) {
          game.advanceToNextDay();
        }
      }

      // 正確に3回発生
      expect(eventCount).toBe(3);
    });

    it('should not trigger old test events when schedule has no event', () => {
      const game = new Game({ scenarioId: 'night_crying' });

      let oldEventCount = 0;

      for (let day = 1; day <= 7; day++) {
        // 夜中フェーズに移行
        game.transitionToMidnight();
        game.update();

        // 旧イベント（currentEvent）が発生していないことを確認
        if (game['currentEvent'] !== null) {
          oldEventCount++;
        }

        // シナリオを完了させる
        if (game['currentScenario']) {
          game.executeChoice('investigate');
          game.executeChoice('play');

          if (game.isWaitingForEmotionInput()) {
            game.recordEmotionForCurrentEvent({
              satisfaction: 3,
              burden: 3,
            });
          }
        }

        // 朝フェーズに移行
        game.transitionToMorning();

        // 次の日へ
        if (day < 7) {
          game.advanceToNextDay();
        }
      }

      // 旧イベントは発生しない（すべてスケジュールに従う）
      expect(oldEventCount).toBe(0);
    });
  });
});
