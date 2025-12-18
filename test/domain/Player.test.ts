/**
 * Playerのテスト
 */

import { Player } from '@/domain/Player';
import { Direction } from '@/domain/types';

describe('Player', () => {
  describe('constructor', () => {
    it('should create Player with default position', () => {
      const player = new Player();

      expect(player.x).toBe(0);
      expect(player.y).toBe(0);
      expect(player.currentAnimation).toBe('idle');
      expect(player.hasToy).toBe(false);
    });

    it('should create Player with custom position', () => {
      const player = new Player({ x: 100, y: 200 });

      expect(player.x).toBe(100);
      expect(player.y).toBe(200);
      expect(player.currentAnimation).toBe('idle');
      expect(player.hasToy).toBe(false);
    });
  });

  describe('move', () => {
    it('should move player UP', () => {
      const player = new Player({ x: 100, y: 100 });
      player.move(Direction.UP);

      expect(player.x).toBe(100);
      expect(player.y).toBe(90); // y - 10
      expect(player.currentAnimation).toBe('walk_up');
    });

    it('should move player DOWN', () => {
      const player = new Player({ x: 100, y: 100 });
      player.move(Direction.DOWN);

      expect(player.x).toBe(100);
      expect(player.y).toBe(110); // y + 10
      expect(player.currentAnimation).toBe('walk_down');
    });

    it('should move player LEFT', () => {
      const player = new Player({ x: 100, y: 100 });
      player.move(Direction.LEFT);

      expect(player.x).toBe(90); // x - 10
      expect(player.y).toBe(100);
      expect(player.currentAnimation).toBe('walk_left');
    });

    it('should move player RIGHT', () => {
      const player = new Player({ x: 100, y: 100 });
      player.move(Direction.RIGHT);

      expect(player.x).toBe(110); // x + 10
      expect(player.y).toBe(100);
      expect(player.currentAnimation).toBe('walk_right');
    });

    it('should not move when direction is NONE', () => {
      const player = new Player({ x: 100, y: 100 });
      player.move(Direction.NONE);

      expect(player.x).toBe(100);
      expect(player.y).toBe(100);
      expect(player.currentAnimation).toBe('idle');
    });
  });

  describe('pickUpToy', () => {
    it('should pick up toy', () => {
      const player = new Player();

      expect(player.hasToy).toBe(false);

      player.pickUpToy();

      expect(player.hasToy).toBe(true);
      expect(player.currentAnimation).toBe('pickup');
    });
  });

  describe('dropToy', () => {
    it('should drop toy', () => {
      const player = new Player();
      player.pickUpToy();

      expect(player.hasToy).toBe(true);

      player.dropToy();

      expect(player.hasToy).toBe(false);
    });
  });

  describe('interact', () => {
    it('should set interaction animation', () => {
      const player = new Player();

      player.interact('cat');

      expect(player.currentAnimation).toBe('interact');
    });
  });
});
