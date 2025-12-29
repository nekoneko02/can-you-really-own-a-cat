/**
 * Gameのテスト（基本機能のみ）
 */

import { Game } from '@/domain/Game';
import { GamePhase } from '@/domain/types';

describe('Game', () => {
  describe('constructor', () => {
    it('should create Game with initial state', () => {
      const game = new Game({ scenarioId: 'night_crying' });

      expect(game.getPhase()).toBe(GamePhase.NIGHT_PREP);
      expect(game.getCurrentDay()).toBe(1);
      expect(game.getCurrentTime()).toBe(2200); // 22:00
    });
  });

  describe('phase transitions', () => {
    it('should transition from NIGHT_PREP to MIDNIGHT_EVENT', () => {
      const game = new Game({ scenarioId: 'night_crying' });

      expect(game.getPhase()).toBe(GamePhase.NIGHT_PREP);

      game.transitionToMidnight();

      expect(game.getPhase()).toBe(GamePhase.MIDNIGHT_EVENT);
      expect(game.getCurrentTime()).toBe(300); // 3:00
    });

    it('should transition from MIDNIGHT_EVENT to MORNING_OUTRO', () => {
      const game = new Game({ scenarioId: 'night_crying' });
      game.transitionToMidnight();

      expect(game.getPhase()).toBe(GamePhase.MIDNIGHT_EVENT);

      game.transitionToMorning();

      expect(game.getPhase()).toBe(GamePhase.MORNING_OUTRO);
      expect(game.getCurrentTime()).toBe(700); // 7:00
    });

    it('should advance to next day', () => {
      const game = new Game({ scenarioId: 'night_crying' });

      expect(game.getCurrentDay()).toBe(1);

      game.advanceToNextDay();

      expect(game.getCurrentDay()).toBe(2);
      expect(game.getPhase()).toBe(GamePhase.NIGHT_PREP);
    });

    it('should transition to GAME_END after day 7', () => {
      const game = new Game({ scenarioId: 'night_crying' });

      // Advance to day 7
      for (let i = 1; i < 7; i++) {
        game.advanceToNextDay();
      }

      expect(game.getCurrentDay()).toBe(7);
      expect(game.getPhase()).not.toBe(GamePhase.GAME_END);

      // After day 7 completes
      game.advanceToNextDay();

      expect(game.getPhase()).toBe(GamePhase.GAME_END);
    });
  });

  describe('recordEmotion', () => {
    it('should record player emotion for event', () => {
      const game = new Game({ scenarioId: 'night_crying' });

      game.recordEmotion({
        eventId: 'E01',
        choiceId: 'wait',
        emotion: { satisfaction: 3, burden: 4 },
      });

      const history = game.getEventHistory();

      expect(history).toHaveLength(1);
      expect(history[0].eventId).toBe('E01');
      expect(history[0].choiceId).toBe('wait');
      expect(history[0].emotion.satisfaction).toBe(3);
      expect(history[0].emotion.burden).toBe(4);
    });
  });

  describe('time progression', () => {
    it('should advance time with updateTime(deltaMs)', () => {
      const game = new Game({ scenarioId: 'night_crying' });
      expect(game.getCurrentTime()).toBe(2200); // 22:00

      // 1分経過（60000ms）- デフォルトスケール1.0
      game.updateTime(60000);

      expect(game.getCurrentTime()).toBe(2201); // 22:01
    });

    it('should advance time with scale applied', () => {
      const game = new Game({ scenarioId: 'night_crying' });
      expect(game.getCurrentTime()).toBe(2200); // 22:00

      // スケール30倍を設定
      game.setTimeScale(30.0);

      // 現実1秒（1000ms）= ゲーム内30秒
      // 現実2秒（2000ms）= ゲーム内1分
      game.updateTime(2000);

      expect(game.getCurrentTime()).toBe(2201); // 22:01
    });

    it('should advance time across hour boundary', () => {
      const game = new Game({ scenarioId: 'night_crying' });
      expect(game.getCurrentTime()).toBe(2200); // 22:00

      // 60分経過
      game.updateTime(60 * 60000);

      expect(game.getCurrentTime()).toBe(2300); // 23:00
    });

    it('should wrap around midnight', () => {
      const game = new Game({ scenarioId: 'night_crying' });
      expect(game.getCurrentTime()).toBe(2200); // 22:00

      // 3時間経過（22:00 → 01:00）
      game.updateTime(3 * 60 * 60000);

      expect(game.getCurrentTime()).toBe(100); // 01:00
    });

    it('should apply phase config when transitioning phase', () => {
      const game = new Game({ scenarioId: 'night_crying' });

      game.transitionToMidnight();

      // MIDNIGHT_EVENTフェーズはPhaseConfigで30倍速
      expect(game.getCurrentTime()).toBe(300); // 3:00

      // 現実2秒（2000ms）× 30倍 = ゲーム内1分
      game.updateTime(2000);
      expect(game.getCurrentTime()).toBe(301); // 3:01
    });
  });
});
