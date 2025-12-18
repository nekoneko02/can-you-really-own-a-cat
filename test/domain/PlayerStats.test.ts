/**
 * PlayerStatsのテスト
 */

import { PlayerStats } from '@/domain/PlayerStats';

describe('PlayerStats', () => {
  describe('constructor', () => {
    it('should create PlayerStats with default values', () => {
      const stats = new PlayerStats();

      expect(stats.totalSleepHours).toBe(0);
      expect(stats.interruptionCount).toBe(0);
      expect(stats.playCount).toBe(0);
    });

    it('should create PlayerStats with custom values', () => {
      const stats = new PlayerStats({
        totalSleepHours: 35,
        interruptionCount: 3,
        playCount: 2,
      });

      expect(stats.totalSleepHours).toBe(35);
      expect(stats.interruptionCount).toBe(3);
      expect(stats.playCount).toBe(2);
    });
  });

  describe('addSleepHours', () => {
    it('should add sleep hours to total', () => {
      const stats = new PlayerStats();
      stats.addSleepHours(7);

      expect(stats.totalSleepHours).toBe(7);

      stats.addSleepHours(6);
      expect(stats.totalSleepHours).toBe(13);
    });

    it('should handle fractional hours', () => {
      const stats = new PlayerStats();
      stats.addSleepHours(4.5);

      expect(stats.totalSleepHours).toBe(4.5);
    });
  });

  describe('incrementInterruptions', () => {
    it('should increment interruption count', () => {
      const stats = new PlayerStats();

      stats.incrementInterruptions();
      expect(stats.interruptionCount).toBe(1);

      stats.incrementInterruptions();
      expect(stats.interruptionCount).toBe(2);
    });
  });

  describe('incrementPlayCount', () => {
    it('should increment play count', () => {
      const stats = new PlayerStats();

      stats.incrementPlayCount();
      expect(stats.playCount).toBe(1);

      stats.incrementPlayCount();
      expect(stats.playCount).toBe(2);
    });
  });

  describe('clone', () => {
    it('should create a deep copy of PlayerStats', () => {
      const original = new PlayerStats({
        totalSleepHours: 35,
        interruptionCount: 3,
        playCount: 2,
      });
      const cloned = original.clone();

      expect(cloned).not.toBe(original);
      expect(cloned.totalSleepHours).toBe(35);
      expect(cloned.interruptionCount).toBe(3);
      expect(cloned.playCount).toBe(2);
    });

    it('should not affect original when cloned object is modified', () => {
      const original = new PlayerStats({ totalSleepHours: 35 });
      const cloned = original.clone();

      cloned.addSleepHours(7);

      expect(original.totalSleepHours).toBe(35);
      expect(cloned.totalSleepHours).toBe(42);
    });
  });
});
