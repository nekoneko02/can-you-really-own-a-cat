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
});
