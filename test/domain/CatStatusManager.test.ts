/**
 * CatStatusManagerのテスト
 */

import { CatStatusManager } from '@/domain/CatStatusManager';

describe('CatStatusManager', () => {
  describe('constructor', () => {
    it('should create CatStatusManager with default status', () => {
      const manager = new CatStatusManager();
      const status = manager.getStatus();

      expect(status.affection).toBe(50);
      expect(status.stress).toBe(0);
      expect(status.health).toBe(100);
      expect(status.hunger).toBe(0);
    });
  });

  describe('updateStatus', () => {
    it('should update cat status', () => {
      const manager = new CatStatusManager();

      manager.updateStatus({ affection: 10, stress: 5 });

      const status = manager.getStatus();
      expect(status.affection).toBe(60); // 50 + 10
      expect(status.stress).toBe(5);     // 0 + 5
    });

    it('should apply multiple updates cumulatively', () => {
      const manager = new CatStatusManager();

      manager.updateStatus({ affection: 10 });
      manager.updateStatus({ affection: 5 });

      const status = manager.getStatus();
      expect(status.affection).toBe(65); // 50 + 10 + 5
    });
  });

  describe('getStatus', () => {
    it('should return current cat status', () => {
      const manager = new CatStatusManager();
      manager.updateStatus({ affection: 20, stress: 10 });

      const status = manager.getStatus();

      expect(status.affection).toBe(70);
      expect(status.stress).toBe(10);
      expect(status.health).toBe(100);
      expect(status.hunger).toBe(0);
    });
  });
});
