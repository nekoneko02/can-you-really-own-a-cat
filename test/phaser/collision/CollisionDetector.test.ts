import { CollisionDetector } from '@/phaser/collision/CollisionDetector';

describe('CollisionDetector', () => {
  let detector: CollisionDetector;

  beforeEach(() => {
    detector = new CollisionDetector();
  });

  describe('isColliding', () => {
    it('should detect collision when objects are at the same position', () => {
      expect(detector.isColliding(100, 100, 100, 100)).toBe(true);
    });

    it('should detect collision when objects are within catch distance', () => {
      // Default catch distance is 50px
      expect(detector.isColliding(100, 100, 130, 100)).toBe(true);
      expect(detector.isColliding(100, 100, 100, 130)).toBe(true);
      expect(detector.isColliding(100, 100, 135, 135)).toBe(true);
    });

    it('should not detect collision when objects are beyond catch distance', () => {
      // Default catch distance is 50px
      expect(detector.isColliding(100, 100, 200, 100)).toBe(false);
      expect(detector.isColliding(100, 100, 100, 200)).toBe(false);
      expect(detector.isColliding(100, 100, 200, 200)).toBe(false);
    });

    it('should handle negative coordinates', () => {
      expect(detector.isColliding(-100, -100, -100, -100)).toBe(true);
      expect(detector.isColliding(-100, -100, -130, -100)).toBe(true);
      expect(detector.isColliding(-100, -100, -200, -100)).toBe(false);
    });

    it('should correctly calculate diagonal distances', () => {
      // Distance of ~42.4 pixels (should collide)
      expect(detector.isColliding(0, 0, 30, 30)).toBe(true);

      // Distance of ~70.7 pixels (should not collide)
      expect(detector.isColliding(0, 0, 50, 50)).toBe(false);
    });

    it('should handle very small distances', () => {
      expect(detector.isColliding(100.5, 100.5, 100.6, 100.6)).toBe(true);
    });

    it('should detect collision at exactly the catch distance boundary', () => {
      // Right at the edge (49.9px - should collide)
      expect(detector.isColliding(0, 0, 49, 0)).toBe(true);

      // Just over the edge (50.1px - should not collide)
      expect(detector.isColliding(0, 0, 51, 0)).toBe(false);
    });
  });

  describe('getCatchDistance', () => {
    it('should return the configured catch distance', () => {
      expect(detector.getCatchDistance()).toBe(50);
    });
  });
});
