/**
 * GameControllerのテスト
 */

import { GameController } from '@/application/GameController';
import { Direction, GamePhase } from '@/domain/types';

describe('GameController', () => {
  describe('constructor', () => {
    it('should create GameController with scenario', () => {
      const controller = new GameController({ scenarioId: 'night_crying' });

      const view = controller.view();

      expect(view.phase).toBe(GamePhase.NIGHT_PREP);
      expect(view.day).toBe(1);
      expect(view.time).toBe(2200);
    });
  });

  describe('view', () => {
    it('should return current game state as GameView', () => {
      const controller = new GameController({ scenarioId: 'night_crying' });

      const view = controller.view();

      expect(view.phase).toBe(GamePhase.NIGHT_PREP);
      expect(view.day).toBe(1);
      expect(view.time).toBe(2200);
      expect(view.player).toBeDefined();
      expect(view.cat).toBeDefined();
      expect(view.catStatus).toBeDefined();
      expect(view.playerStats).toBeDefined();
    });

    it('should include player position and state', () => {
      const controller = new GameController({ scenarioId: 'night_crying' });

      const view = controller.view();

      expect(view.player.x).toBe(100);
      expect(view.player.y).toBe(100);
      expect(view.player.animation).toBe('idle');
      expect(view.player.hasToy).toBe(false);
    });

    it('should include cat position and state', () => {
      const controller = new GameController({ scenarioId: 'night_crying' });

      const view = controller.view();

      expect(view.cat.x).toBe(200);
      expect(view.cat.y).toBe(200);
      expect(view.cat.state).toBeDefined();
      expect(view.cat.mood).toBeDefined();
    });
  });

  describe('tick', () => {
    it('should process player movement input', () => {
      const controller = new GameController({ scenarioId: 'night_crying' });

      controller.tick({ direction: Direction.RIGHT });

      const view = controller.view();
      expect(view.player.x).toBe(110); // moved +10
    });

    it('should handle multiple movement inputs', () => {
      const controller = new GameController({ scenarioId: 'night_crying' });

      controller.tick({ direction: Direction.RIGHT });
      controller.tick({ direction: Direction.UP });

      const view = controller.view();
      expect(view.player.x).toBe(110); // moved +10
      expect(view.player.y).toBe(90);  // moved -10
    });

    it('should handle interact input', () => {
      const controller = new GameController({ scenarioId: 'night_crying' });

      controller.tick({ interact: true });

      const view = controller.view();
      expect(view.player.animation).toBe('interact');
    });
  });
});
