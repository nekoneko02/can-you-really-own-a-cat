/**
 * Consequenceのテスト
 */

import { Consequence } from '@/domain/Consequence';
import { CatStatusParams } from '@/domain/CatStatus';
import { PlayerStatsParams } from '@/domain/PlayerStats';

describe('Consequence', () => {
  describe('constructor', () => {
    it('should create Consequence with minimal data', () => {
      const consequence = new Consequence({
        text: 'The cat fell asleep.',
        eventCompleted: true,
      });

      expect(consequence.text).toBe('The cat fell asleep.');
      expect(consequence.catStateChanges).toEqual({});
      expect(consequence.playerStatsChanges).toEqual({});
      expect(consequence.eventCompleted).toBe(true);
    });

    it('should create Consequence with cat state changes', () => {
      const catChanges: Partial<CatStatusParams> = {
        affection: 10,
        stress: -5,
      };

      const consequence = new Consequence({
        text: 'You played with the cat.',
        catStateChanges: catChanges,
        eventCompleted: false,
      });

      expect(consequence.text).toBe('You played with the cat.');
      expect(consequence.catStateChanges).toEqual(catChanges);
      expect(consequence.eventCompleted).toBe(false);
    });

    it('should create Consequence with player stats changes', () => {
      const playerChanges: Partial<PlayerStatsParams> = {
        playCount: 1,
      };

      const consequence = new Consequence({
        text: 'You played with the cat.',
        playerStatsChanges: playerChanges,
        eventCompleted: true,
      });

      expect(consequence.text).toBe('You played with the cat.');
      expect(consequence.playerStatsChanges).toEqual(playerChanges);
      expect(consequence.eventCompleted).toBe(true);
    });

    it('should create Consequence with both cat and player changes', () => {
      const catChanges: Partial<CatStatusParams> = {
        affection: 15,
        stress: -10,
      };
      const playerChanges: Partial<PlayerStatsParams> = {
        playCount: 1,
        interruptionCount: 1,
      };

      const consequence = new Consequence({
        text: 'You caught the cat.',
        catStateChanges: catChanges,
        playerStatsChanges: playerChanges,
        eventCompleted: true,
      });

      expect(consequence.text).toBe('You caught the cat.');
      expect(consequence.catStateChanges).toEqual(catChanges);
      expect(consequence.playerStatsChanges).toEqual(playerChanges);
      expect(consequence.eventCompleted).toBe(true);
    });
  });
});
