/**
 * CatStatusのテスト
 */

import { CatStatus } from '@/domain/CatStatus';

describe('CatStatus', () => {
  describe('constructor', () => {
    it('should create CatStatus with default values', () => {
      const status = new CatStatus();

      expect(status.affection).toBe(50);
      expect(status.stress).toBe(0);
      expect(status.health).toBe(100);
      expect(status.hunger).toBe(0);
    });

    it('should create CatStatus with custom values', () => {
      const status = new CatStatus({
        affection: 80,
        stress: 20,
        health: 90,
        hunger: 30,
      });

      expect(status.affection).toBe(80);
      expect(status.stress).toBe(20);
      expect(status.health).toBe(90);
      expect(status.hunger).toBe(30);
    });
  });

  describe('update', () => {
    it('should update status with partial changes', () => {
      const status = new CatStatus();
      status.update({ affection: 10, stress: 5 });

      expect(status.affection).toBe(60); // 50 + 10
      expect(status.stress).toBe(5);     // 0 + 5
      expect(status.health).toBe(100);   // unchanged
      expect(status.hunger).toBe(0);     // unchanged
    });

    it('should clamp affection between 0 and 100', () => {
      const status = new CatStatus({ affection: 50 });

      status.update({ affection: 60 });
      expect(status.affection).toBe(100); // 50 + 60 = 110 -> clamped to 100

      status.update({ affection: -150 });
      expect(status.affection).toBe(0); // 100 - 150 = -50 -> clamped to 0
    });

    it('should clamp stress between 0 and 100', () => {
      const status = new CatStatus({ stress: 50 });

      status.update({ stress: 60 });
      expect(status.stress).toBe(100); // 50 + 60 = 110 -> clamped to 100

      status.update({ stress: -150 });
      expect(status.stress).toBe(0); // 100 - 150 = -50 -> clamped to 0
    });

    it('should clamp health between 0 and 100', () => {
      const status = new CatStatus({ health: 50 });

      status.update({ health: 60 });
      expect(status.health).toBe(100); // 50 + 60 = 110 -> clamped to 100

      status.update({ health: -150 });
      expect(status.health).toBe(0); // 100 - 150 = -50 -> clamped to 0
    });

    it('should clamp hunger between 0 and 100', () => {
      const status = new CatStatus({ hunger: 50 });

      status.update({ hunger: 60 });
      expect(status.hunger).toBe(100); // 50 + 60 = 110 -> clamped to 100

      status.update({ hunger: -150 });
      expect(status.hunger).toBe(0); // 100 - 150 = -50 -> clamped to 0
    });
  });

  describe('clone', () => {
    it('should create a deep copy of CatStatus', () => {
      const original = new CatStatus({ affection: 80, stress: 20 });
      const cloned = original.clone();

      expect(cloned).not.toBe(original);
      expect(cloned.affection).toBe(80);
      expect(cloned.stress).toBe(20);
      expect(cloned.health).toBe(100);
      expect(cloned.hunger).toBe(0);
    });

    it('should not affect original when cloned object is modified', () => {
      const original = new CatStatus({ affection: 50 });
      const cloned = original.clone();

      cloned.update({ affection: 30 });

      expect(original.affection).toBe(50);
      expect(cloned.affection).toBe(80);
    });
  });
});
